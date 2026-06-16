import { Request, Response } from 'express';
import { db } from '../utils/db';
import { PterodactylService } from '../services/pterodactyl.service';
const logActivity = async (serverId: string, userId: string, action: string, ipAddress: string | null, details: string | null = null) => {
  await db.serverActivityLog.create({
    data: { serverId, userId, action, ipAddress, details }
  });
};
import WebSocket from 'ws';

export class ServerPanelController {

  public static async getStatus(req: Request, res: Response) {
    const server = (req as any).server;
    if (!server.pterodactylIdentifier) return res.json({ currentState: 'OFFLINE', usage: { cpu: 0, memory_bytes: 0, disk_bytes: 0, uptime: 0 } });
    
    try {
      const pteroStats = await PterodactylService.getServerStatus(server.pterodactylIdentifier);
      
      console.log(`[Status Debug] Raw Pterodactyl API response for ${server.pterodactylIdentifier}:`, JSON.stringify(pteroStats));

      const stateMap: Record<string, string> = {
        'running': 'ONLINE',
        'offline': 'OFFLINE',
        'starting': 'STARTING',
        'stopping': 'STOPPING'
      };

      const mappedState = stateMap[pteroStats.current_state] || pteroStats.current_state?.toUpperCase() || 'OFFLINE';

      const finalResponse = {
        currentState: mappedState,
        isSuspended: pteroStats.is_suspended,
        usage: {
          cpu: pteroStats.resources?.cpu_absolute || 0,
          memory_bytes: pteroStats.resources?.memory_bytes || 0,
          disk_bytes: pteroStats.resources?.disk_bytes || 0,
          network_rx_bytes: pteroStats.resources?.network_rx_bytes || 0,
          network_tx_bytes: pteroStats.resources?.network_tx_bytes || 0,
          uptime: pteroStats.resources?.uptime || 0
        }
      };

      console.log(`[Status Debug] Final JSON returned to frontend for ${server.pterodactylIdentifier}:`, JSON.stringify(finalResponse));

      // Synchronize database status
      const dbStateMap: Record<string, string> = {
        'running': 'RUNNING',
        'offline': 'STOPPED',
        'starting': 'STARTING',
        'stopping': 'STOPPING'
      };
      
      const mappedDbState = dbStateMap[pteroStats.current_state] || 'STOPPED';

      if (server.status !== mappedDbState) {
        await db.server.update({ where: { id: server.id }, data: { status: mappedDbState as any } });
      }

      res.json(finalResponse);
    } catch (err: any) {
      console.error(`[Status Debug] Error fetching status for ${server.pterodactylIdentifier}:`, err.message);
      res.json({ currentState: 'OFFLINE', usage: { cpu: 0, memory_bytes: 0, disk_bytes: 0, uptime: 0 } });
    }
  }

  public static async getWebsocket(req: Request, res: Response) {
    const server = (req as any).server;
    console.log(`[Websocket] Fetching credentials for FreeBucks DB Server ID: ${server.id}, Pterodactyl Identifier: ${server.pterodactylIdentifier}`);
    
    if (!server.pterodactylIdentifier) {
      return res.status(400).json({ error: 'Server is still provisioning. Please wait.' });
    }

    try {
      const creds = await PterodactylService.getWebsocketCredentials(server.pterodactylIdentifier);
      res.json(creds);
    } catch (err: any) {
      console.error(`[Websocket] Failed to fetch credentials for server ${server.id} (Ptero: ${server.pterodactylIdentifier}):`, err.message);
      if (err.response) {
        console.error(`[Websocket] Pterodactyl Response Status:`, err.response.status);
        console.error(`[Websocket] Pterodactyl Response Body:`, JSON.stringify(err.response.data));
        return res.status(err.response.status).json({ error: `Pterodactyl error: ${err.response.data?.errors?.[0]?.detail || 'Unknown Pterodactyl Error'}` });
      }
      return res.status(502).json({ error: 'Failed to connect to game panel daemon. Daemon might be offline.' });
    }
  }



  public static async powerAction(req: Request, res: Response) {
    const server = (req as any).server;
    const { action } = req.body; // start, stop, restart, kill
    if (!server.pterodactylIdentifier) return res.status(400).json({ error: 'Not provisioned' });

    if (action === 'start') await PterodactylService.startServer(server.pterodactylIdentifier);
    else if (action === 'stop') await PterodactylService.powerServer(server.pterodactylIdentifier, 'stop');
    else if (action === 'kill') await PterodactylService.powerServer(server.pterodactylIdentifier, 'kill');
    else if (action === 'restart') await PterodactylService.powerServer(server.pterodactylIdentifier, 'restart');
    
    await logActivity(server.id, req.user!.id, `power.${action}`, req.ip || null);
    res.json({ success: true });
  }

  public static async sendCommand(req: Request, res: Response) {
    const server = (req as any).server;
    const { command } = req.body;
    if (!server.pterodactylIdentifier) return res.status(400).json({ error: 'Not provisioned' });
    await PterodactylService.sendCommand(server.pterodactylIdentifier, command);
    await logActivity(server.id, req.user!.id, 'command.sent', req.ip || null, `Sent command: ${command.substring(0,20)}...`);
    res.json({ success: true });
  }

  // --- Files ---
  public static async listFiles(req: Request, res: Response) {
    const server = (req as any).server;
    const directory = req.query.directory as string || '/';
    if (!server.pterodactylIdentifier) return res.json([]);
    const files = await PterodactylService.listFiles(server.pterodactylIdentifier, directory);
    const mappedFiles = files.map((f: any) => ({
      name: f.name,
      isFile: f.is_file,
      size: f.size,
      modifiedAt: f.modified_at
    }));
    res.json(mappedFiles);
  }

  public static async getFileContent(req: Request, res: Response) {
    const server = (req as any).server;
    const file = req.query.file as string;
    if (!server.pterodactylIdentifier) return res.json({ content: '' });
    const content = await PterodactylService.getFileContent(server.pterodactylIdentifier, file);
    res.json({ content });
  }

  public static async saveFileContent(req: Request, res: Response) {
    const server = (req as any).server;
    const { file, content } = req.body;
    if (!server.pterodactylIdentifier) return res.status(400).json({ error: 'Not provisioned' });
    // Check size limit (e.g. 2MB)
    if (Buffer.byteLength(content, 'utf8') > 2 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size exceeds 2MB limit for editor.' });
    }
    await PterodactylService.saveFileContent(server.pterodactylIdentifier, file, content);
    await logActivity(server.id, req.user!.id, 'file.edit', req.ip || null, file);
    res.json({ success: true });
  }

  public static async renameFiles(req: Request, res: Response) {
    const server = (req as any).server;
    const { root, files } = req.body;
    if (!server.pterodactylIdentifier) return res.status(400).json({ error: 'Not provisioned' });
    await PterodactylService.renameFiles(server.pterodactylIdentifier, root, files);
    await logActivity(server.id, req.user!.id, 'file.rename', req.ip || null, `Renamed ${files.length} items in ${root}`);
    res.json({ success: true });
  }

  public static async createFolder(req: Request, res: Response) {
    const server = (req as any).server;
    const { root, name } = req.body;
    if (!server.pterodactylIdentifier) return res.status(400).json({ error: 'Not provisioned' });
    await PterodactylService.createFolder(server.pterodactylIdentifier, root, name);
    await logActivity(server.id, req.user!.id, 'folder.create', req.ip || null, `${root}/${name}`);
    res.json({ success: true });
  }

  public static async deleteFiles(req: Request, res: Response) {
    const server = (req as any).server;
    const { root, files } = req.body;
    if (!server.pterodactylIdentifier) return res.status(400).json({ error: 'Not provisioned' });
    await PterodactylService.deleteFiles(server.pterodactylIdentifier, root, files);
    await logActivity(server.id, req.user!.id, 'file.delete', req.ip || null, `Deleted ${files.length} items in ${root}`);
    res.json({ success: true });
  }

  public static async getUploadUrl(req: Request, res: Response) {
    const server = (req as any).server;
    if (!server.pterodactylIdentifier) return res.status(400).json({ error: 'Not provisioned' });
    const url = await PterodactylService.getUploadUrl(server.pterodactylIdentifier);
    res.json({ url });
  }

  public static async getDownloadUrl(req: Request, res: Response) {
    const server = (req as any).server;
    const file = req.query.file as string;
    if (!server.pterodactylIdentifier) return res.status(400).json({ error: 'Not provisioned' });
    const url = await PterodactylService.getDownloadUrl(server.pterodactylIdentifier, file);
    res.json({ url });
  }

  // --- Users (Server Access) ---
  public static async listUsers(req: Request, res: Response) {
    const serverId = req.params.id as string;
    const accesses = await db.serverAccess.findMany({
      where: { serverId },
      include: { user: { select: { id: true, username: true, email: true, discordId: true, avatar: true } } }
    });
    res.json(accesses);
  }

  public static async inviteUser(req: Request, res: Response) {
    const serverId = req.params.id as string;
    const { emailOrDiscord, permissions } = req.body;
    
    // Find user
    const targetUser = await db.user.findFirst({
      where: {
        OR: [
          { email: emailOrDiscord },
          { discordId: emailOrDiscord }
        ]
      }
    });

    if (!targetUser) return res.status(404).json({ error: 'User not found' });
    if (targetUser.id === req.user!.id) return res.status(400).json({ error: 'Cannot invite yourself' });

    const server = (req as any).server;
    if (server.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Only the server owner can invite users.' });
    }

    const access = await db.serverAccess.upsert({
      where: { serverId_userId: { serverId, userId: targetUser.id } },
      update: { permissions: JSON.stringify(permissions) },
      create: { serverId, userId: targetUser.id, permissions: JSON.stringify(permissions) }
    });

    await logActivity(serverId, req.user!.id, 'user.invite', req.ip || null, targetUser.username);
    res.json(access);
  }

  public static async removeUser(req: Request, res: Response) {
    const serverId = req.params.id as string;
    const accessId = req.params.accessId as string;

    const server = (req as any).server;
    if (server.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Only the server owner can remove users.' });
    }

    await db.serverAccess.delete({ where: { id: accessId } });
    await logActivity(serverId, req.user!.id, 'user.remove', req.ip || null, `Access ID: ${accessId}`);
    res.json({ success: true });
  }

  // --- Subdomain ---
  public static async getSubdomain(req: Request, res: Response) {
    const serverId = req.params.id as string;
    const sub = await db.serverSubdomain.findUnique({ where: { serverId } });
    res.json(sub);
  }

  public static async generateSubdomain(req: Request, res: Response) {
    const serverId = req.params.id as string;
    const { requestedSubdomain } = req.body;

    const regex = /^[a-z0-9]+$/;
    if (!regex.test(requestedSubdomain)) return res.status(400).json({ error: 'Invalid subdomain format' });

    // Check uniqueness
    const exists = await db.serverSubdomain.findUnique({ where: { subdomain: requestedSubdomain } });
    if (exists && exists.serverId !== serverId) {
      return res.status(400).json({ error: 'Subdomain already taken' });
    }

    const sub = await db.serverSubdomain.upsert({
      where: { serverId },
      update: { subdomain: requestedSubdomain, status: 'Pending DNS Provisioning' },
      create: { serverId, subdomain: requestedSubdomain, status: 'Pending DNS Provisioning' }
    });

    await logActivity(serverId, req.user!.id, 'subdomain.update', req.ip || null, requestedSubdomain);
    res.json(sub);
  }

  // --- Activity ---
  public static async getActivity(req: Request, res: Response) {
    const serverId = req.params.id as string;
    const logs = await db.serverActivityLog.findMany({
      where: { serverId },
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { user: { select: { id: true, username: true } } }
    });
    res.json(logs);
  }

  // --- Settings ---
  public static async updateSettings(req: Request, res: Response) {
    const serverId = req.params.id as string;
    const { name } = req.body;
    await db.server.update({ where: { id: serverId }, data: { name } });
    await logActivity(serverId, req.user!.id, 'settings.update', req.ip || null, `Renamed to ${name}`);
    res.json({ success: true });
  }

  public static async reinstallServer(req: Request, res: Response) {
    const server = (req as any).server;
    if (!server.pterodactylIdentifier) return res.status(400).json({ error: 'Not provisioned' });
    await PterodactylService.reinstallServer(server.pterodactylIdentifier);
    await logActivity(server.id, req.user!.id, 'server.reinstall', req.ip || null, 'Triggered reinstallation');
    res.json({ success: true });
  }

  // --- Startup ---
  public static async getStartup(req: Request, res: Response) {
    const server = (req as any).server;
    if (!server.pterodactylIdentifier) return res.json({ variables: [], dockerImage: null });
    
    const vars = await PterodactylService.getStartupVariables(server.pterodactylIdentifier);
    let dockerImage = null;
    if (server.pterodactylServerId) {
      dockerImage = await PterodactylService.getServerDockerImage(server.pterodactylServerId);
    }
    
    res.json({ variables: vars, dockerImage });
  }

  public static async updateDockerImage(req: Request, res: Response) {
    const server = (req as any).server;
    const { dockerImage } = req.body;
    if (!server.pterodactylIdentifier) return res.status(400).json({ error: 'Not provisioned' });
    if (!dockerImage) return res.status(400).json({ error: 'Missing dockerImage' });
    
    await PterodactylService.updateDockerImage(server.pterodactylIdentifier, dockerImage);
    await logActivity(server.id, req.user!.id, 'startup.update', req.ip || null, `Updated Docker Image to ${dockerImage}`);
    res.json({ success: true });
  }

  public static async updateStartup(req: Request, res: Response) {
    const server = (req as any).server;
    const { key, value } = req.body;
    if (!server.pterodactylIdentifier) return res.status(400).json({ error: 'Not provisioned' });
    await PterodactylService.updateStartupVariable(server.pterodactylIdentifier, key, value);
    await logActivity(server.id, req.user!.id, 'startup.update', req.ip || null, `Updated ${key}`);
    res.json({ success: true });
  }
}

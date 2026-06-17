import { Request, Response } from 'express';
import { db } from '../utils/db';
import { PterodactylService } from '../services/pterodactyl.service';
import { CloudflareService } from '../services/cloudflare.service';
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
    const server = (req as any).server;
    
    const accesses = await db.serverAccess.findMany({
      where: { serverId },
      include: {
        user: { select: { id: true, username: true, email: true, avatar: true } }
      }
    });

    const invites = await db.serverInvite.findMany({
      where: { serverId, status: 'PENDING' }
    });

    res.json({ accesses, invites });
  }

  public static async inviteUser(req: Request, res: Response) {
    const serverId = req.params.id as string;
    const { emailOrDiscord, permissions } = req.body;
    
    if (!emailOrDiscord || !emailOrDiscord.trim()) {
      return res.status(400).json({ error: 'Email or Discord ID is required' });
    }

    const server = (req as any).server;
    if (server.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Only the server owner can invite users.' });
    }

    const isEmail = emailOrDiscord.includes('@');
    const email = isEmail ? emailOrDiscord.trim().toLowerCase() : null;
    const discordId = !isEmail ? emailOrDiscord.trim() : null;

    // Check if user is trying to invite themselves
    const reqUser = req.user as any;
    if ((email && reqUser.email?.toLowerCase() === email) || (discordId && reqUser.discordId === discordId)) {
      return res.status(400).json({ error: 'Cannot invite yourself' });
    }

    // Check if the user already has access
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          ...(discordId ? [{ discordId }] : [])
        ]
      }
    });

    if (existingUser) {
      const existingAccess = await db.serverAccess.findUnique({
        where: { serverId_userId: { serverId, userId: existingUser.id } }
      });
      if (existingAccess) {
        return res.status(400).json({ error: 'User already has access to this server.' });
      }
    }

    // Check for duplicate pending invites
    const duplicateInvite = await db.serverInvite.findFirst({
      where: {
        serverId,
        status: 'PENDING',
        OR: [
          ...(email ? [{ email }] : []),
          ...(discordId ? [{ discordId }] : [])
        ]
      }
    });

    if (duplicateInvite) {
      return res.status(400).json({ error: 'Invite already pending.' });
    }

    const invite = await db.serverInvite.create({
      data: {
        serverId,
        email,
        discordId,
        permissions: JSON.stringify(permissions)
      }
    });

    await logActivity(serverId, req.user!.id, 'user.invite', req.ip || null, emailOrDiscord);
    res.json(invite);
  }

  public static async removeUser(req: Request, res: Response) {
    const serverId = req.params.id as string;
    const accessId = req.params.accessId as string;

    const server = (req as any).server;
    if (server.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Only the server owner can remove users.' });
    }

    await db.serverAccess.delete({ where: { id: accessId } });
    await logActivity(serverId, req.user!.id, 'user.remove', req.ip || null, accessId);
    res.json({ success: true });
  }

  public static async cancelInvite(req: Request, res: Response) {
    const serverId = req.params.id as string;
    const inviteId = req.params.inviteId as string;

    const server = (req as any).server;
    if (server.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Only the server owner can cancel invites.' });
    }

    await db.serverInvite.delete({ where: { id: inviteId } });
    await logActivity(serverId, req.user!.id, 'invite.cancel', req.ip || null, inviteId);
    res.json({ success: true });
  }

  // User-facing invite methods (not bound to server middleware)
  public static async listUserInvites(req: Request, res: Response) {
    const user = await db.user.findUnique({ where: { id: req.user!.id } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    console.log('[DEBUG INVITE] Current logged-in user:', { id: user.id, email: user.email, discordId: user.discordId });

    const orConditions = [
      ...(user.email ? [{ email: user.email.toLowerCase() }] : []),
      ...(user.discordId ? [{ discordId: user.discordId }] : [])
    ];

    if (orConditions.length === 0) {
      return res.json([]);
    }

    console.log('[DEBUG INVITE] Query OR conditions:', orConditions);

    const invites = await db.serverInvite.findMany({
      where: {
        status: 'PENDING',
        OR: orConditions.length > 0 ? orConditions : undefined
      },
      include: {
        server: { select: { id: true, name: true, user: { select: { username: true } } } }
      }
    });

    console.log('[DEBUG INVITE] Found invites count:', invites.length);
    console.log('[DEBUG INVITE] Latest pending invites in DB:', await db.serverInvite.findMany({ where: { status: 'PENDING' }, take: 5 }));

    res.json(invites);
  }

  public static async acceptInvite(req: Request, res: Response) {
    const inviteId = req.params.inviteId as string;
    const user = await db.user.findUnique({ where: { id: req.user!.id } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const orConditions = [
      ...(user.email ? [{ email: user.email.toLowerCase() }] : []),
      ...(user.discordId ? [{ discordId: user.discordId }] : [])
    ];

    if (orConditions.length === 0) {
      return res.status(404).json({ error: 'Invite not found or already processed' });
    }

    const invite = await db.serverInvite.findFirst({
      where: {
        id: inviteId,
        status: 'PENDING',
        OR: orConditions
      }
    });

    if (!invite) return res.status(404).json({ error: 'Invite not found or already processed' });

    await db.$transaction([
      db.serverInvite.update({ where: { id: invite.id }, data: { status: 'ACCEPTED' } }),
      db.serverAccess.upsert({
        where: { serverId_userId: { serverId: invite.serverId, userId: user.id } },
        update: { permissions: invite.permissions },
        create: { serverId: invite.serverId, userId: user.id, permissions: invite.permissions }
      })
    ]);

    await logActivity(invite.serverId, req.user!.id, 'invite.accept', req.ip || null, user.username);
    res.json({ success: true });
  }

  public static async declineInvite(req: Request, res: Response) {
    const inviteId = req.params.inviteId as string;
    const user = await db.user.findUnique({ where: { id: req.user!.id } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const orConditions = [
      ...(user.email ? [{ email: user.email.toLowerCase() }] : []),
      ...(user.discordId ? [{ discordId: user.discordId }] : [])
    ];

    if (orConditions.length === 0) {
      return res.status(404).json({ error: 'Invite not found or already processed' });
    }

    const invite = await db.serverInvite.findFirst({
      where: {
        id: inviteId,
        status: 'PENDING',
        OR: orConditions
      }
    });

    if (!invite) return res.status(404).json({ error: 'Invite not found or already processed' });

    await db.serverInvite.update({ where: { id: invite.id }, data: { status: 'DECLINED' } });
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

    const server = await db.server.findUnique({ where: { id: serverId } });
    if (!server) return res.status(404).json({ error: 'Server not found' });

    try {
      const allocation = await PterodactylService.getServerAllocation(server.pterodactylIdentifier as string);
      if (!allocation || !allocation.ip || !allocation.port) {
        return res.status(400).json({ error: 'Could not fetch server allocation details.' });
      }

      // Provision via Cloudflare
      await CloudflareService.createMinecraftSubdomain(requestedSubdomain, allocation.ip, allocation.port);

      const sub = await db.serverSubdomain.upsert({
        where: { serverId },
        update: { subdomain: requestedSubdomain, status: 'Active' },
        create: { serverId, subdomain: requestedSubdomain, status: 'Active' }
      });

      await logActivity(serverId, req.user!.id, 'subdomain.update', req.ip || null, requestedSubdomain);
      res.json(sub);
    } catch (err: any) {
      console.error('[Subdomain Generation Error]', err);
      // Fallback or explicit failure
      await db.serverSubdomain.upsert({
        where: { serverId },
        update: { subdomain: requestedSubdomain, status: `Failed: ${err.message}` },
        create: { serverId, subdomain: requestedSubdomain, status: `Failed: ${err.message}` }
      });
      return res.status(400).json({ error: err.message || 'Failed to provision subdomain.' });
    }
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



  public static async acceptEula(req: Request, res: Response) {
    const server = (req as any).server;
    if (!server.pterodactylIdentifier) return res.status(400).json({ error: 'Server is not provisioned.' });
    
    try {
      const stateBefore = await PterodactylService.getServerStatus(server.pterodactylIdentifier);
      console.log(`[EULA] Server state BEFORE accept:`, stateBefore.current_state);

      await PterodactylService.acceptEula(server.pterodactylIdentifier);
      
      const eulaContent = await PterodactylService.getFileContent(server.pterodactylIdentifier, '/eula.txt').catch(() => 'Failed to read eula.txt');
      console.log(`[EULA] eula.txt contents verified:\n${eulaContent}`);

      // Force a restart to ensure Wings clears crash state and Pterodactyl UI sees the restart
      await PterodactylService.powerServer(server.pterodactylIdentifier, 'restart');

      const stateAfter = await PterodactylService.getServerStatus(server.pterodactylIdentifier);
      console.log(`[EULA] Server state AFTER restart signal:`, stateAfter.current_state);

      await logActivity(server.id, req.user!.id, 'EULA_ACCEPTED', req.ip || null, 'Accepted Minecraft EULA');
      res.json({ success: true });
    } catch (error: any) {
      console.error('[EULA Accept Error]', error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to accept EULA. Please try again or accept manually in the Files tab.' });
    }
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

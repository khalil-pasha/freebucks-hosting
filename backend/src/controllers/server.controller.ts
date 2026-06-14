import { Request, Response } from 'express';
import { db } from '../utils/db';
import { PterodactylService } from '../services/pterodactyl.service';
import { AuditService } from '../services/audit.service';
import { SettingsService } from '../services/settings.service';

export class ServerController {
  public static async createServer(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { name, ramGB, cpu, disk, pterodactyl } = req.body;

      if (!name || !ramGB || !cpu || !disk) {
        return res.status(400).json({ error: 'Missing required server parameters' });
      }

      const user = await db.user.findUnique({
        where: { id: userId },
        include: { 
          premiumOrders: { where: { status: 'COMPLETED' } },
          servers: { where: { status: { notIn: ['ARCHIVED'] } } }
        }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.premiumOrders.length === 0 && user.servers.length >= 1) {
        return res.status(403).json({ error: 'You already have an active free server. Upgrade to premium to create more servers.' });
      }

      const globalServerCap = await SettingsService.getNumber('globalServerCap');
      const totalActiveServers = await db.server.count({ where: { status: { notIn: ['ARCHIVED'] } } });
      if (totalActiveServers >= globalServerCap) {
        return res.status(403).json({ error: 'Global server capacity reached. Please try again later.' });
      }

      let costPerHour = 0;
      if (ramGB === 2 && cpu === 100 && disk === 5) costPerHour = await SettingsService.getNumber('serverRate2GB');
      else if (ramGB === 4 && cpu === 150 && disk === 10) costPerHour = await SettingsService.getNumber('serverRate4GB');
      else if (ramGB === 6 && cpu === 200 && disk === 15) costPerHour = await SettingsService.getNumber('serverRate6GB');
      else {
        if (user.premiumOrders.length === 0) {
          return res.status(403).json({ error: '8GB+ or Custom servers require an active Premium Order.' });
        }
        costPerHour = 0; // Premium users don't burn credits for their allocated limits
      }

      let pteroUserId = user.pterodactylUserId;

      if (!pteroUserId) {
        if (!pterodactyl || !pterodactyl.email || !pterodactyl.username || !pterodactyl.firstName || !pterodactyl.lastName || !pterodactyl.password) {
          return res.status(400).json({ error: 'Pterodactyl user details required for first-time server creation.' });
        }
        
        pteroUserId = await PterodactylService.createUser(
          pterodactyl.email,
          pterodactyl.username,
          pterodactyl.firstName,
          pterodactyl.lastName,
          pterodactyl.password
        );

        await db.user.update({
          where: { id: userId },
          data: { pterodactylUserId: pteroUserId }
        });
      }

      const pteroData = await PterodactylService.createServer(name, ramGB, cpu, disk, pteroUserId);

      const server = await db.server.create({
        data: {
          userId,
          name,
          ramGB,
          cpu,
          disk,
          costPerHour,
          status: 'STOPPED',
          pterodactylServerId: pteroData.id,
          pterodactylIdentifier: pteroData.identifier,
        }
      });

      await AuditService.logAction(req, 'SERVER_CREATE', server.id, userId);

      res.status(201).json(server);
    } catch (error: any) {
      console.error(error.response?.data || error);
      const errorMessage = error.response?.data?.errors?.[0]?.detail || error.response?.data?.message || error.message || 'An unknown error occurred while creating the server.';
      res.status(500).json({ error: errorMessage });
    }
  }

  public static async upgradeServer(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const serverId = req.params.id as string;
      const { ramGB, cpu, disk } = req.body;

      const server = await db.server.findFirst({
        where: { id: serverId, userId }
      });

      if (!server) {
        return res.status(404).json({ error: 'Server not found' });
      }

      const user = await db.user.findUnique({
        where: { id: userId },
        include: { premiumOrders: { where: { status: 'COMPLETED' } } }
      });

      let costPerHour = 0;
      if (ramGB === 2 && cpu === 100 && disk === 5) costPerHour = await SettingsService.getNumber('serverRate2GB');
      else if (ramGB === 4 && cpu === 150 && disk === 10) costPerHour = await SettingsService.getNumber('serverRate4GB');
      else if (ramGB === 6 && cpu === 200 && disk === 15) costPerHour = await SettingsService.getNumber('serverRate6GB');
      else {
        if (!user || user.premiumOrders.length === 0) {
          return res.status(403).json({ error: '8GB+ or Custom servers require an active Premium Order.' });
        }
        costPerHour = 0;
      }

      await PterodactylService.updateServerBuild(server.pterodactylServerId as number, ramGB, cpu, disk);

      const updatedServer = await db.server.update({
        where: { id: serverId },
        data: { ramGB, cpu, disk, costPerHour }
      });

      await AuditService.logAction(req, 'SERVER_UPGRADE', serverId, userId);

      res.json(updatedServer);
    } catch (error: any) {
      console.error(error.response?.data || error);
      res.status(500).json({ error: 'Failed to upgrade server' });
    }
  }

  public static async myServers(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const servers = await db.server.findMany({ where: { userId } });
      
      const enrichedServers = await Promise.all(servers.map(async (server) => {
        const allocation = await PterodactylService.getServerAllocation(server.pterodactylIdentifier as string);
        let liveStatus = 'OFFLINE';
        let liveUsage = { cpu: 0, memory_bytes: 0, disk_bytes: 0 };
        try {
          const stats = await PterodactylService.getServerStatus(server.pterodactylIdentifier as string);
          
          const stateMap: Record<string, string> = {
            'running': 'ONLINE',
            'offline': 'OFFLINE',
            'starting': 'STARTING',
            'stopping': 'STOPPING'
          };
          liveStatus = stateMap[stats.current_state] || stats.current_state?.toUpperCase() || 'OFFLINE';
          
          liveUsage = {
            cpu: stats.resources?.cpu_absolute || 0,
            memory_bytes: stats.resources?.memory_bytes || 0,
            disk_bytes: stats.resources?.disk_bytes || 0
          };
        } catch (err) {
          // Ignore if daemon offline
        }
        
        return {
          ...server,
          allocationIp: allocation?.ip || null,
          allocationAlias: allocation?.alias || null,
          allocationPort: allocation?.port || null,
          liveStatus,
          liveUsage
        };
      }));

      res.json(enrichedServers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async getRates(req: Request, res: Response) {
    try {
      const serverRate2GB = await SettingsService.getNumber('serverRate2GB');
      const serverRate4GB = await SettingsService.getNumber('serverRate4GB');
      const serverRate6GB = await SettingsService.getNumber('serverRate6GB');
      
      res.json({
        serverRate2GB,
        serverRate4GB,
        serverRate6GB
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

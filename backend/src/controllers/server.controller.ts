import { Request, Response } from 'express';
import { db } from '../utils/db';
import { PterodactylService } from '../services/pterodactyl.service';
import { AuditService } from '../services/audit.service';

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

      let costPerHour = 0;
      if (ramGB === 2 && cpu === 100 && disk === 5) costPerHour = 1.5;
      else if (ramGB === 4 && cpu === 150 && disk === 10) costPerHour = 3;
      else if (ramGB === 6 && cpu === 200 && disk === 15) costPerHour = 6;
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

  public static async myServers(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const servers = await db.server.findMany({ where: { userId } });
      res.json(servers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

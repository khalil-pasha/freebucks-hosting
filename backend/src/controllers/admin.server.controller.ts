import { Request, Response } from 'express';
import { db } from '../utils/db';
import { PterodactylService } from '../services/pterodactyl.service';

export class AdminServerController {
  public static async suspendServer(req: Request, res: Response) {
    try {
      const { serverId } = req.body;
      const server = await db.server.findUnique({ where: { id: serverId } });
      if (!server || !server.pterodactylServerId) return res.status(404).json({ error: 'Server not found' });

      await PterodactylService.suspendServer(server.pterodactylServerId);
      
      await db.server.update({
        where: { id: serverId },
        data: { status: 'ARCHIVED' }
      });

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async deleteServer(req: Request, res: Response) {
    try {
      const { serverId } = req.body;
      const server = await db.server.findUnique({ where: { id: serverId } });
      if (!server || !server.pterodactylServerId) return res.status(404).json({ error: 'Server not found' });

      await PterodactylService.deleteServer(server.pterodactylServerId);
      
      await db.server.delete({ where: { id: serverId } });

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async forceStop(req: Request, res: Response) {
    try {
      const { serverId } = req.body;
      const server = await db.server.findUnique({ where: { id: serverId } });
      if (!server || !server.pterodactylIdentifier) return res.status(404).json({ error: 'Server not found' });

      await PterodactylService.stopServer(server.pterodactylIdentifier);
      
      await db.server.update({
        where: { id: serverId },
        data: { status: 'STOPPED' }
      });

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

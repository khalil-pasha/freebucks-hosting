import { Request, Response } from 'express';
import { db } from '../utils/db';
import { PterodactylService } from '../services/pterodactyl.service';
import { AuditService } from '../services/audit.service';

export class AdminServerController {
  public static async suspendServer(req: Request, res: Response) {
    try {
      const { serverId } = req.body;
      const server = await db.server.findUnique({ where: { id: serverId } });
      if (!server) return res.status(404).json({ error: 'Server not found' });

      if (server.pterodactylServerId) {
        try {
          await PterodactylService.suspendServer(server.pterodactylServerId);
        } catch (pteroError: any) {
          console.error('Pterodactyl suspend error:', pteroError.response?.data || pteroError.message);
          // Continue to sync DB state even if Pterodactyl panel fails
        }
      }
      
      await db.server.update({
        where: { id: serverId },
        data: { status: 'ARCHIVED' }
      });

      await AuditService.logAction(req, 'ADMIN_SUSPEND_SERVER', serverId, req.user!.id);

      res.json({ success: true });
    } catch (error: any) {
      console.error('Suspend server error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  public static async deleteServer(req: Request, res: Response) {
    try {
      const { serverId } = req.body;
      const server = await db.server.findUnique({ where: { id: serverId } });
      if (!server) return res.status(404).json({ error: 'Server not found' });

      if (server.pterodactylServerId) {
        try {
          // Pterodactyl API requires force=true to delete a running server, 
          // or we just attempt a delete and catch failure
          await PterodactylService.deleteServer(server.pterodactylServerId);
        } catch (pteroError: any) {
          console.error('Pterodactyl delete error:', pteroError.response?.data || pteroError.message);
        }
      }
      
      // Cascade delete related records first to prevent foreign key constraint errors
      await db.serverBillingLog.deleteMany({ where: { serverId } });
      await db.queueJob.deleteMany({ where: { serverId } });
      
      await db.server.delete({ where: { id: serverId } });

      await AuditService.logAction(req, 'ADMIN_DELETE_SERVER', serverId, req.user!.id);

      res.json({ success: true });
    } catch (error: any) {
      console.error('Delete server error:', error);
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

      await AuditService.logAction(req, 'ADMIN_FORCE_STOP_SERVER', serverId, req.user!.id);

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

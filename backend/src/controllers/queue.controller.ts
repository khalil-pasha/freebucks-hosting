import { Request, Response } from 'express';
import { QueueService } from '../services/queue.service';
import { db } from '../utils/db';

export class QueueController {
  public static async startServer(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { serverId } = req.body;

      if (!serverId) {
        return res.status(400).json({ error: 'serverId is required' });
      }

      // Verify server ownership
      const server = await db.server.findUnique({ where: { id: serverId } });
      if (!server || server.userId !== userId) {
        return res.status(403).json({ error: 'Server not found or unauthorized' });
      }

      const owner = await db.user.findUnique({ where: { id: server.userId } });
      if (!owner || owner.balance <= 0) {
        console.log(`[CREDITS] Insufficient balance blocked start (Queue Endpoint)`);
        return res.status(400).json({ error: 'Insufficient credits. Please top up your balance.' });
      }

      const data = await QueueService.addStartJob(userId, serverId);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async restartServer(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { serverId } = req.body;

      if (!serverId) {
        return res.status(400).json({ error: 'serverId is required' });
      }

      const server = await db.server.findUnique({ where: { id: serverId } });
      if (!server || server.userId !== userId) {
        return res.status(403).json({ error: 'Server not found or unauthorized' });
      }

      const owner = await db.user.findUnique({ where: { id: server.userId } });
      if (!owner || owner.balance <= 0) {
        console.log(`[CREDITS] Insufficient balance blocked start (Queue Endpoint)`);
        return res.status(400).json({ error: 'Insufficient credits. Please top up your balance.' });
      }

      const data = await QueueService.addRestartJob(userId, serverId);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async cancel(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { serverId } = req.body;

      if (!serverId) return res.status(400).json({ error: 'serverId is required' });

      // If they are stopping it completely bypasses queue
      const data = await QueueService.stopServer(userId, serverId);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async getStatus(req: Request, res: Response) {
    try {
      const serverId = req.params.serverId as string;
      const data = await QueueService.getStatus(serverId);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async myJobs(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const data = await QueueService.getMyJobs(userId);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

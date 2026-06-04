import { Request, Response } from 'express';
import { AdminQueueService } from '../services/queue.service';

export class AdminQueueController {
  public static async pause(req: Request, res: Response) {
    try {
      const data = await AdminQueueService.pauseQueue();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async resume(req: Request, res: Response) {
    try {
      const data = await AdminQueueService.resumeQueue();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async cancel(req: Request, res: Response) {
    try {
      const { bullJobId } = req.body;
      const data = await AdminQueueService.cancelJob(bullJobId);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async retry(req: Request, res: Response) {
    try {
      const { bullJobId } = req.body;
      const data = await AdminQueueService.retryJob(bullJobId);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async activeSlots(req: Request, res: Response) {
    try {
      const active = await AdminQueueService.getActiveSlots();
      const waiting = await AdminQueueService.getWaitingJobs();
      res.json({ ...active, waiting });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

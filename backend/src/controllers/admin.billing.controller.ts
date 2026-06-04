import { Request, Response } from 'express';
import { db } from '../utils/db';

export class AdminBillingController {
  public static async getLogs(req: Request, res: Response) {
    try {
      const logs = await db.serverBillingLog.findMany({
        orderBy: { timestamp: 'desc' },
        take: 100,
        include: { server: { select: { name: true, userId: true } } }
      });
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async getRunningServers(req: Request, res: Response) {
    try {
      const servers = await db.server.findMany({
        where: { status: 'RUNNING' },
        include: { user: { select: { username: true, balance: true } } }
      });
      res.json(servers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async getAutoStopped(req: Request, res: Response) {
    try {
      const logs = await db.serverBillingLog.findMany({
        where: { reason: 'INSUFFICIENT_CREDITS_STOP' },
        orderBy: { timestamp: 'desc' },
        take: 50,
        include: { server: { select: { name: true, userId: true } } }
      });
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async getStats(req: Request, res: Response) {
    try {
      const result = await db.creditsTransaction.aggregate({
        where: { type: 'SPENT', source: 'SERVER_BILLING' },
        _sum: { amount: true }
      });
      res.json({ totalCreditsBurned: result._sum.amount || 0 });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

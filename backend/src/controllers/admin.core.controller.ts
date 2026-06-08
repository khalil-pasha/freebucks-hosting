import { Request, Response } from 'express';
import { db } from '../utils/db';

export class AdminCoreController {
  public static async getDashboardStats(req: Request, res: Response) {
    try {
      const now = new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const totalUsers = await db.user.count();
      const activeUsers = await db.user.count({
        where: { updatedAt: { gte: last24Hours } }
      });
      
      const creditsBurnedQuery = await db.creditsTransaction.aggregate({
        where: { type: 'SPENT', source: 'SERVER_BILLING' },
        _sum: { amount: true }
      });
      
      const creditsEarnedQuery = await db.creditsTransaction.aggregate({
        where: { type: 'EARNED' },
        _sum: { amount: true }
      });

      // Group new users by day for the last 7 days
      // Since prisma doesn't support grouping by raw date string out of the box easily across dialects,
      // we'll fetch them and bucket them manually for the last 7 days.
      const recentUsers = await db.user.findMany({
        where: { createdAt: { gte: last7Days } },
        select: { createdAt: true }
      });
      
      const newUsersHistory = new Array(7).fill(0);
      recentUsers.forEach(u => {
        const diffTime = Math.abs(now.getTime() - u.createdAt.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 7) {
          // reverse index so day 0 is 7 days ago, day 6 is today
          newUsersHistory[6 - diffDays]++;
        }
      });

      res.json({
        totalUsers,
        activeUsers,
        totalCreditsBurned: creditsBurnedQuery._sum.amount || 0,
        totalCreditsEarned: creditsEarnedQuery._sum.amount || 0,
        newUsersHistory
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async getUsers(req: Request, res: Response) {
    try {
      const users = await db.user.findMany({
        select: {
          id: true,
          discordId: true,
          username: true,
          balance: true,
          createdAt: true,
          role: true,
          _count: {
            select: { servers: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async getServers(req: Request, res: Response) {
    try {
      const servers = await db.server.findMany({
        include: {
          user: { select: { username: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
      res.json(servers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async getCredits(req: Request, res: Response) {
    try {
      const transactions = await db.creditsTransaction.findMany({
        include: {
          user: { select: { username: true } }
        },
        orderBy: { timestamp: 'desc' },
        take: 100
      });
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async getVouchers(req: Request, res: Response) {
    try {
      const vouchers = await db.voucher.findMany({
        include: {
          _count: { select: { claims: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
      res.json(vouchers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async getReferrals(req: Request, res: Response) {
    try {
      const referrals = await db.referral.findMany({
        include: {
          referrer: { select: { username: true } },
          referred: { select: { username: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
      res.json(referrals);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async getPremiumOrders(req: Request, res: Response) {
    try {
      const orders = await db.premiumOrder.findMany({
        include: {
          user: { select: { username: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async getLogs(req: Request, res: Response) {
    try {
      const logs = await db.auditLog.findMany({
        orderBy: { timestamp: 'desc' },
        take: 200
      });
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async getTickets(req: Request, res: Response) {
    try {
      const tickets = await db.supportTicket.findMany({
        include: {
          user: { select: { username: true } },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        },
        orderBy: { updatedAt: 'desc' }
      });
      res.json(tickets);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async getUser(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const user = await db.user.findUnique({
        where: { id },
        include: {
          servers: true,
          transactions: {
            orderBy: { timestamp: 'desc' },
            take: 10
          }
        }
      });
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

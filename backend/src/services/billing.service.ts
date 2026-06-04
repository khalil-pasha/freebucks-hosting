import { db } from '../utils/db';

export class BillingService {
  /**
   * Attempts to deduct the hourly cost for a server.
   * Returns true if successful, false if insufficient credits.
   */
  public static async deductCost(serverId: string, reason: string): Promise<boolean> {
    return await db.$transaction(async (tx: any) => {
      // 1. Fetch server and user
      const server = await tx.server.findUnique({
        where: { id: serverId },
        include: { user: true }
      });

      if (!server || !server.user) {
        throw new Error('Server or User not found for billing');
      }

      // Check balance
      if (server.user.balance < server.costPerHour) {
        // Insufficient funds -> Stop the server
        await tx.server.update({
          where: { id: serverId },
          data: { status: 'STOPPED' }
        });

        // Log the stop event
        await tx.serverBillingLog.create({
          data: {
            serverId,
            amountDeducted: 0,
            reason: 'INSUFFICIENT_CREDITS_STOP'
          }
        });
        
        return false;
      }

      // Sufficient funds -> Deduct and Log
      await tx.user.update({
        where: { id: server.user.id },
        data: { balance: { decrement: server.costPerHour } }
      });

      await tx.serverBillingLog.create({
        data: {
          serverId,
          amountDeducted: server.costPerHour,
          reason
        }
      });

      await tx.creditsTransaction.create({
        data: {
          userId: server.user.id,
          amount: server.costPerHour,
          type: 'SPENT',
          source: 'SERVER_BILLING'
        }
      });

      return true;
    });
  }

  /**
   * Cron job method: runs every minute
   * Finds running servers that haven't been billed in 60 minutes
   */
  public static async processHourlyBilling() {
    try {
      const runningServers = await db.server.findMany({
        where: { status: 'RUNNING' }
      });

      const now = new Date();
      // 60 minutes in ms = 3600000
      const ONE_HOUR_MS = 60 * 60 * 1000;

      for (const server of runningServers) {
        // Find latest billing log for this server
        const lastLog = await db.serverBillingLog.findFirst({
          where: { serverId: server.id },
          orderBy: { timestamp: 'desc' }
        });

        // If no log exists for some reason, or it's been >= 60 mins
        if (!lastLog || (now.getTime() - lastLog.timestamp.getTime()) >= ONE_HOUR_MS) {
          console.log(`[BillingService] Processing hourly deduction for Server ${server.id}`);
          await this.deductCost(server.id, 'HOURLY_DEDUCTION');
        }
      }
    } catch (error) {
      console.error('[BillingService] Hourly Billing Error:', error);
    }
  }
}

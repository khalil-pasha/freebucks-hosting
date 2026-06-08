import { db } from '../utils/db';
import { toZonedTime, fromZonedTime, format } from 'date-fns-tz';
import { startOfDay, addHours } from 'date-fns';
import { SettingsService } from './settings.service';
import { NotificationService } from './notification.service';

const TIMEZONE = 'Asia/Kolkata';

export class CreditsService {
  /**
   * Returns the start of the current day in IST, converted to UTC Date object
   */
  private static getStartOfDayIST(): Date {
    const now = new Date();
    const zonedNow = toZonedTime(now, TIMEZONE);
    const startOfZonedDay = startOfDay(zonedNow);
    return fromZonedTime(startOfZonedDay, TIMEZONE);
  }

  /**
   * Calculates total credits earned TODAY (IST) from free methods (hourly, spin)
   */
  public static async getDailyEarned(userId: string): Promise<number> {
    const startOfDayUTC = this.getStartOfDayIST();

    const transactions = await db.creditsTransaction.findMany({
      where: {
        userId,
        type: 'EARNED',
        timestamp: {
          gte: startOfDayUTC,
        },
        source: {
          in: ['HOURLY_CLAIM', 'DAILY_SPIN'], // Only these count towards 35 limit
        },
      },
    });

    return transactions.reduce((acc: number, tx: any) => acc + tx.amount, 0);
  }

  public static async getBalance(userId: string) {
    const user = await db.user.findUnique({ where: { id: userId }, select: { balance: true } });
    if (!user) throw new Error('User not found');

    const dailyLimit = await SettingsService.getNumber('dailyCreditCap');
    const dailyEarnedFree = await this.getDailyEarned(userId);
    
    const startOfDayUTC = this.getStartOfDayIST();

    const allEarnedTransactions = await db.creditsTransaction.findMany({
      where: { userId, type: 'EARNED', timestamp: { gte: startOfDayUTC } },
    });
    const dailyEarnedTotal = allEarnedTransactions.reduce((acc: number, tx: any) => acc + tx.amount, 0);

    const allSpentTransactions = await db.creditsTransaction.findMany({
      where: { userId, type: 'SPENT', timestamp: { gte: startOfDayUTC } },
    });
    const dailySpent = allSpentTransactions.reduce((acc: number, tx: any) => acc + tx.amount, 0);

    return {
      balance: user.balance,
      dailyEarnedTotal,
      dailyEarnedFree,
      dailySpent,
      dailyLimit,
      remainingDailyCap: Math.max(0, dailyLimit - dailyEarnedFree)
    };
  }

  public static async claimHourly(userId: string) {
    return await db.$transaction(async (tx: any) => {
      // Check last hourly claim
      const lastClaim = await tx.creditsTransaction.findFirst({
        where: { userId, source: 'HOURLY_CLAIM' },
        orderBy: { timestamp: 'desc' },
      });

      if (lastClaim && (new Date().getTime() - lastClaim.timestamp.getTime()) < 60 * 60 * 1000) {
        throw new Error('You must wait 1 hour between claims.');
      }

      const dailyLimit = await SettingsService.getNumber('dailyCreditCap');
      const hourlyReward = await SettingsService.getNumber('hourlyClaimReward');

      const dailyEarned = await this.getDailyEarned(userId);
      const remainingCap = Math.max(0, dailyLimit - dailyEarned);

      if (remainingCap <= 0) {
        throw new Error('Daily earning limit reached. Come back tomorrow!');
      }

      const rewardAmount = Math.min(hourlyReward, remainingCap);

      await tx.user.update({
        where: { id: userId },
        data: { balance: { increment: rewardAmount } },
      });

      const transaction = await tx.creditsTransaction.create({
        data: {
          userId,
          amount: rewardAmount,
          type: 'EARNED',
          source: 'HOURLY_CLAIM',
        },
      });

      await NotificationService.createNotification(
        userId,
        'Hourly Claim Successful',
        `You have received ${rewardAmount} credits from your hourly claim.`,
        'CREDIT_CLAIM'
      );

      return {
        amount: rewardAmount,
        transaction
      };
    });
  }

  public static async claimDailySpin(userId: string, rolledAmount: number) {
    return await db.$transaction(async (tx: any) => {
      // Check last daily spin
      const lastSpin = await tx.creditsTransaction.findFirst({
        where: { userId, source: 'DAILY_SPIN' },
        orderBy: { timestamp: 'desc' },
      });

      if (lastSpin && (new Date().getTime() - lastSpin.timestamp.getTime()) < 24 * 60 * 60 * 1000) {
        throw new Error('You must wait 24 hours between spins.');
      }

      const dailyLimit = await SettingsService.getNumber('dailyCreditCap');
      const dailyEarned = await this.getDailyEarned(userId);
      const remainingCap = Math.max(0, dailyLimit - dailyEarned);

      if (remainingCap <= 0) {
        throw new Error('Daily earning limit reached. You cannot spin today.');
      }

      // Respect the cap
      const rewardAmount = Math.min(rolledAmount, remainingCap);

      await tx.user.update({
        where: { id: userId },
        data: { balance: { increment: rewardAmount } },
      });

      const transaction = await tx.creditsTransaction.create({
        data: {
          userId,
          amount: rewardAmount,
          type: 'EARNED',
          source: 'DAILY_SPIN',
        },
      });

      await NotificationService.createNotification(
        userId,
        'Daily Spin Successful',
        `You won ${rewardAmount} credits from the daily spin!`,
        'CREDIT_CLAIM'
      );

      return {
        originalRoll: rolledAmount,
        actualReward: rewardAmount,
        transaction
      };
    });
  }

  public static async getHistory(userId: string) {
    return await db.creditsTransaction.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 50
    });
  }

  public static async getRewardStatus(userId: string) {
    const lastSpin = await db.creditsTransaction.findFirst({
      where: { userId, source: 'DAILY_SPIN' },
      orderBy: { timestamp: 'desc' },
    });

    const lastHourly = await db.creditsTransaction.findFirst({
      where: { userId, source: 'HOURLY_CLAIM' },
      orderBy: { timestamp: 'desc' },
    });

    const now = new Date().getTime();
    
    let nextDailySpinAt = null;
    let dailySpinCooldown = 0;
    if (lastSpin) {
      const nextTime = lastSpin.timestamp.getTime() + 24 * 60 * 60 * 1000;
      if (nextTime > now) {
        nextDailySpinAt = new Date(nextTime);
        dailySpinCooldown = nextTime - now;
      }
    }

    let nextHourlyClaimAt = null;
    let hourlyClaimCooldown = 0;
    if (lastHourly) {
      const nextTime = lastHourly.timestamp.getTime() + 60 * 60 * 1000;
      if (nextTime > now) {
        nextHourlyClaimAt = new Date(nextTime);
        hourlyClaimCooldown = nextTime - now;
      }
    }

    return {
      lastDailySpinAt: lastSpin?.timestamp || null,
      nextDailySpinAt,
      dailySpinCooldown,
      lastHourlyClaimAt: lastHourly?.timestamp || null,
      nextHourlyClaimAt,
      hourlyClaimCooldown
    };
  }
}

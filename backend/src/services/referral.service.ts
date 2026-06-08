import { db } from '../utils/db';
import { SettingsService } from './settings.service';
import { NotificationService } from './notification.service';

export class ReferralService {
  public static async claimReferralReward(referrerId: string, referredId: string) {
    return await db.$transaction(async (tx: any) => {
      // Find referral
      const referral = await tx.referral.findFirst({
        where: {
          referrerId,
          referredId,
          status: 'PENDING',
        },
      });

      if (!referral) {
        throw new Error('Valid pending referral not found.');
      }

      // In real life we'd verify if referred user created a server here
      // E.g. const servers = await tx.server.count({ where: { userId: referredId } });
      // if (servers === 0) throw new Error('Referred user must create a server first.');

      // Rewards (bypasses daily limit)
      const referrerReward = await SettingsService.getNumber('referralSenderReward');
      const referredReward = await SettingsService.getNumber('referralReceiverReward');

      // Update Referrer
      await tx.user.update({
        where: { id: referrerId },
        data: { balance: { increment: referrerReward } },
      });
      await tx.creditsTransaction.create({
        data: {
          userId: referrerId,
          amount: referrerReward,
          type: 'EARNED',
          source: 'REFERRAL_REWARD',
        },
      });

      // Update Referred User
      await tx.user.update({
        where: { id: referredId },
        data: { balance: { increment: referredReward } },
      });
      await tx.creditsTransaction.create({
        data: {
          userId: referredId,
          amount: referredReward,
          type: 'EARNED',
          source: 'REFERRAL_BONUS',
        },
      });

      // Mark referral completed
      await tx.referral.update({
        where: { id: referral.id },
        data: { status: 'COMPLETED' },
      });

      await NotificationService.createNotification(
        referrerId,
        'Referral Reward Received',
        `You received ${referrerReward} credits for referring a user!`,
        'REFERRAL'
      );

      await NotificationService.createNotification(
        referredId,
        'Welcome Bonus Received',
        `You received ${referredReward} credits as a welcome bonus!`,
        'REFERRAL'
      );

      return {
        success: true,
        referrerReward,
        referredReward,
      };
    });
  }

  public static async getStats(userId: string) {
    const totalInvited = await db.referral.count({
      where: { referrerId: userId }
    });

    const pendingInstalls = await db.referral.count({
      where: { referrerId: userId, status: 'PENDING' }
    });

    const earnedTransactions = await db.creditsTransaction.findMany({
      where: { userId, source: 'REFERRAL_REWARD' }
    });

    const totalEarned = earnedTransactions.reduce((acc: number, tx: any) => acc + tx.amount, 0);

    const senderReward = await SettingsService.getNumber('referralSenderReward');
    const receiverReward = await SettingsService.getNumber('referralReceiverReward');

    return {
      totalInvited,
      totalEarned,
      pendingInstalls,
      senderReward,
      receiverReward
    };
  }
}

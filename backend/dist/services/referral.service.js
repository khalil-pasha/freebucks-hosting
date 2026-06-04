"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferralService = void 0;
const db_1 = require("../utils/db");
class ReferralService {
    static async claimReferralReward(referrerId, referredId) {
        return await db_1.db.$transaction(async (tx) => {
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
            const referrerReward = 25;
            const referredReward = 50;
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
            return {
                success: true,
                referrerReward,
                referredReward,
            };
        });
    }
}
exports.ReferralService = ReferralService;

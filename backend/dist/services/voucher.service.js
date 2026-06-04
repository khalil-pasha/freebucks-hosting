"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoucherService = void 0;
const db_1 = require("../utils/db");
class VoucherService {
    static async redeemVoucher(userId, code) {
        return await db_1.db.$transaction(async (tx) => {
            // Find voucher
            const voucher = await tx.voucher.findUnique({ where: { code } });
            if (!voucher) {
                throw new Error('Invalid voucher code.');
            }
            if (voucher.expiresAt && voucher.expiresAt < new Date()) {
                throw new Error('This voucher has expired.');
            }
            if (voucher.currentUses >= voucher.maxUses) {
                throw new Error('This voucher has reached its maximum number of uses.');
            }
            // Check if user already claimed
            const existingClaim = await tx.voucherClaim.findUnique({
                where: {
                    voucherId_userId: {
                        voucherId: voucher.id,
                        userId,
                    },
                },
            });
            if (existingClaim) {
                throw new Error('You have already redeemed this voucher.');
            }
            // Claim it
            await tx.voucherClaim.create({
                data: {
                    voucherId: voucher.id,
                    userId,
                },
            });
            // Update uses
            await tx.voucher.update({
                where: { id: voucher.id },
                data: { currentUses: { increment: 1 } },
            });
            // Add credits (bypasses 35 daily limit)
            await tx.user.update({
                where: { id: userId },
                data: { balance: { increment: voucher.rewardAmount } },
            });
            // Log transaction
            const transaction = await tx.creditsTransaction.create({
                data: {
                    userId,
                    amount: voucher.rewardAmount,
                    type: 'EARNED',
                    source: 'VOUCHER',
                },
            });
            return {
                amount: voucher.rewardAmount,
                transaction,
            };
        });
    }
}
exports.VoucherService = VoucherService;

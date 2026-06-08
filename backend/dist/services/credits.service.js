"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditsService = void 0;
const db_1 = require("../utils/db");
const date_fns_tz_1 = require("date-fns-tz");
const date_fns_1 = require("date-fns");
const settings_service_1 = require("./settings.service");
const notification_service_1 = require("./notification.service");
const TIMEZONE = 'Asia/Kolkata';
class CreditsService {
    /**
     * Returns the start of the current day in IST, converted to UTC Date object
     */
    static getStartOfDayIST() {
        const now = new Date();
        const zonedNow = (0, date_fns_tz_1.toZonedTime)(now, TIMEZONE);
        const startOfZonedDay = (0, date_fns_1.startOfDay)(zonedNow);
        return (0, date_fns_tz_1.fromZonedTime)(startOfZonedDay, TIMEZONE);
    }
    /**
     * Calculates total credits earned TODAY (IST) from free methods (hourly, spin)
     */
    static async getDailyEarned(userId) {
        const startOfDayUTC = this.getStartOfDayIST();
        const transactions = await db_1.db.creditsTransaction.findMany({
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
        return transactions.reduce((acc, tx) => acc + tx.amount, 0);
    }
    static async getBalance(userId) {
        const user = await db_1.db.user.findUnique({ where: { id: userId }, select: { balance: true } });
        if (!user)
            throw new Error('User not found');
        const dailyLimit = await settings_service_1.SettingsService.getNumber('dailyCreditCap');
        const dailyEarnedFree = await this.getDailyEarned(userId);
        const startOfDayUTC = this.getStartOfDayIST();
        const allEarnedTransactions = await db_1.db.creditsTransaction.findMany({
            where: { userId, type: 'EARNED', timestamp: { gte: startOfDayUTC } },
        });
        const dailyEarnedTotal = allEarnedTransactions.reduce((acc, tx) => acc + tx.amount, 0);
        const allSpentTransactions = await db_1.db.creditsTransaction.findMany({
            where: { userId, type: 'SPENT', timestamp: { gte: startOfDayUTC } },
        });
        const dailySpent = allSpentTransactions.reduce((acc, tx) => acc + tx.amount, 0);
        return {
            balance: user.balance,
            dailyEarnedTotal,
            dailyEarnedFree,
            dailySpent,
            dailyLimit,
            remainingDailyCap: Math.max(0, dailyLimit - dailyEarnedFree)
        };
    }
    static async claimHourly(userId) {
        return await db_1.db.$transaction(async (tx) => {
            // Check last hourly claim
            const lastClaim = await tx.creditsTransaction.findFirst({
                where: { userId, source: 'HOURLY_CLAIM' },
                orderBy: { timestamp: 'desc' },
            });
            if (lastClaim && (new Date().getTime() - lastClaim.timestamp.getTime()) < 60 * 60 * 1000) {
                throw new Error('You must wait 1 hour between claims.');
            }
            const dailyLimit = await settings_service_1.SettingsService.getNumber('dailyCreditCap');
            const hourlyReward = await settings_service_1.SettingsService.getNumber('hourlyClaimReward');
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
            await notification_service_1.NotificationService.createNotification(userId, 'Hourly Claim Successful', `You have received ${rewardAmount} credits from your hourly claim.`, 'CREDIT_CLAIM');
            return {
                amount: rewardAmount,
                transaction
            };
        });
    }
    static async claimDailySpin(userId, rolledAmount) {
        return await db_1.db.$transaction(async (tx) => {
            // Check last daily spin
            const lastSpin = await tx.creditsTransaction.findFirst({
                where: { userId, source: 'DAILY_SPIN' },
                orderBy: { timestamp: 'desc' },
            });
            if (lastSpin && (new Date().getTime() - lastSpin.timestamp.getTime()) < 24 * 60 * 60 * 1000) {
                throw new Error('You must wait 24 hours between spins.');
            }
            const dailyLimit = await settings_service_1.SettingsService.getNumber('dailyCreditCap');
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
            await notification_service_1.NotificationService.createNotification(userId, 'Daily Spin Successful', `You won ${rewardAmount} credits from the daily spin!`, 'CREDIT_CLAIM');
            return {
                originalRoll: rolledAmount,
                actualReward: rewardAmount,
                transaction
            };
        });
    }
    static async getHistory(userId) {
        return await db_1.db.creditsTransaction.findMany({
            where: { userId },
            orderBy: { timestamp: 'desc' },
            take: 50
        });
    }
}
exports.CreditsService = CreditsService;

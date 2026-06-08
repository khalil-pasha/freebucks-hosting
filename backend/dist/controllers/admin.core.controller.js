"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminCoreController = void 0;
const db_1 = require("../utils/db");
class AdminCoreController {
    static async getDashboardStats(req, res) {
        try {
            const now = new Date();
            const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const totalUsers = await db_1.db.user.count();
            const activeUsers = await db_1.db.user.count({
                where: { updatedAt: { gte: last24Hours } }
            });
            const creditsBurnedQuery = await db_1.db.creditsTransaction.aggregate({
                where: { type: 'SPENT', source: 'SERVER_BILLING' },
                _sum: { amount: true }
            });
            const creditsEarnedQuery = await db_1.db.creditsTransaction.aggregate({
                where: { type: 'EARNED' },
                _sum: { amount: true }
            });
            // Group new users by day for the last 7 days
            // Since prisma doesn't support grouping by raw date string out of the box easily across dialects,
            // we'll fetch them and bucket them manually for the last 7 days.
            const recentUsers = await db_1.db.user.findMany({
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
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getUsers(req, res) {
        try {
            const users = await db_1.db.user.findMany({
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
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getServers(req, res) {
        try {
            const servers = await db_1.db.server.findMany({
                include: {
                    user: { select: { username: true } }
                },
                orderBy: { createdAt: 'desc' }
            });
            res.json(servers);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getCredits(req, res) {
        try {
            const transactions = await db_1.db.creditsTransaction.findMany({
                include: {
                    user: { select: { username: true } }
                },
                orderBy: { timestamp: 'desc' },
                take: 100
            });
            res.json(transactions);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getVouchers(req, res) {
        try {
            const vouchers = await db_1.db.voucher.findMany({
                include: {
                    _count: { select: { claims: true } }
                },
                orderBy: { createdAt: 'desc' }
            });
            res.json(vouchers);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getReferrals(req, res) {
        try {
            const referrals = await db_1.db.referral.findMany({
                include: {
                    referrer: { select: { username: true } },
                    referred: { select: { username: true } }
                },
                orderBy: { createdAt: 'desc' }
            });
            res.json(referrals);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getPremiumOrders(req, res) {
        try {
            const orders = await db_1.db.premiumOrder.findMany({
                include: {
                    user: { select: { username: true } }
                },
                orderBy: { createdAt: 'desc' }
            });
            res.json(orders);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getLogs(req, res) {
        try {
            const logs = await db_1.db.auditLog.findMany({
                orderBy: { timestamp: 'desc' },
                take: 200
            });
            res.json(logs);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getTickets(req, res) {
        try {
            const tickets = await db_1.db.supportTicket.findMany({
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
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.AdminCoreController = AdminCoreController;

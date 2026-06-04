"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminBillingController = void 0;
const db_1 = require("../utils/db");
class AdminBillingController {
    static async getLogs(req, res) {
        try {
            const logs = await db_1.db.serverBillingLog.findMany({
                orderBy: { timestamp: 'desc' },
                take: 100,
                include: { server: { select: { name: true, userId: true } } }
            });
            res.json(logs);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getRunningServers(req, res) {
        try {
            const servers = await db_1.db.server.findMany({
                where: { status: 'RUNNING' },
                include: { user: { select: { username: true, balance: true } } }
            });
            res.json(servers);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getAutoStopped(req, res) {
        try {
            const logs = await db_1.db.serverBillingLog.findMany({
                where: { reason: 'INSUFFICIENT_CREDITS_STOP' },
                orderBy: { timestamp: 'desc' },
                take: 50,
                include: { server: { select: { name: true, userId: true } } }
            });
            res.json(logs);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getStats(req, res) {
        try {
            const result = await db_1.db.creditsTransaction.aggregate({
                where: { type: 'SPENT', source: 'SERVER_BILLING' },
                _sum: { amount: true }
            });
            res.json({ totalCreditsBurned: result._sum.amount || 0 });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.AdminBillingController = AdminBillingController;

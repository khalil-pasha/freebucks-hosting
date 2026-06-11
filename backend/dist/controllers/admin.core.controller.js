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
    static async addCredits(req, res) {
        try {
            const { identifier, amount, reason } = req.body;
            if (!identifier || !amount || amount <= 0)
                return res.status(400).json({ error: 'Valid identifier and positive amount required' });
            let user = await db_1.db.user.findUnique({ where: { discordId: identifier } });
            if (!user)
                user = await db_1.db.user.findFirst({ where: { username: identifier } });
            if (!user)
                return res.status(404).json({ error: `User '${identifier}' not found` });
            await db_1.db.user.update({
                where: { id: user.id },
                data: { balance: { increment: amount } }
            });
            await db_1.db.creditsTransaction.create({
                data: {
                    userId: user.id,
                    amount: amount,
                    type: 'EARNED',
                    source: reason || 'ADMIN_ADD'
                }
            });
            res.json({ success: true, newBalance: user.balance + amount });
        }
        catch (error) {
            console.error('Add credits error:', error);
            res.status(500).json({ error: error.message });
        }
    }
    static async removeCredits(req, res) {
        try {
            const { identifier, amount, reason } = req.body;
            if (!identifier || !amount || amount <= 0)
                return res.status(400).json({ error: 'Valid identifier and positive amount required' });
            let user = await db_1.db.user.findUnique({ where: { discordId: identifier } });
            if (!user)
                user = await db_1.db.user.findFirst({ where: { username: identifier } });
            if (!user)
                return res.status(404).json({ error: `User '${identifier}' not found` });
            const newBalance = Math.max(0, user.balance - amount);
            await db_1.db.user.update({
                where: { id: user.id },
                data: { balance: newBalance }
            });
            await db_1.db.creditsTransaction.create({
                data: {
                    userId: user.id,
                    amount: Math.min(user.balance, amount), // Don't log more than what was actually removed
                    type: 'SPENT',
                    source: reason || 'ADMIN_REMOVE'
                }
            });
            res.json({ success: true, newBalance });
        }
        catch (error) {
            console.error('Remove credits error:', error);
            res.status(500).json({ error: error.message });
        }
    }
    static async resetCredits(req, res) {
        try {
            const { identifier, reason } = req.body;
            if (!identifier)
                return res.status(400).json({ error: 'Identifier required' });
            let user = await db_1.db.user.findUnique({ where: { discordId: identifier } });
            if (!user)
                user = await db_1.db.user.findFirst({ where: { username: identifier } });
            if (!user)
                return res.status(404).json({ error: `User '${identifier}' not found` });
            const removedAmount = user.balance;
            await db_1.db.user.update({
                where: { id: user.id },
                data: { balance: 0 }
            });
            if (removedAmount > 0) {
                await db_1.db.creditsTransaction.create({
                    data: {
                        userId: user.id,
                        amount: removedAmount,
                        type: 'SPENT',
                        source: reason || 'ADMIN_RESET'
                    }
                });
            }
            res.json({ success: true, newBalance: 0 });
        }
        catch (error) {
            console.error('Reset credits error:', error);
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
    static async createVoucher(req, res) {
        try {
            const { code, rewardAmount, maxUses } = req.body;
            if (!code || !rewardAmount || !maxUses) {
                return res.status(400).json({ error: 'Code, rewardAmount, and maxUses are required' });
            }
            const existing = await db_1.db.voucher.findUnique({ where: { code: code.toUpperCase() } });
            if (existing) {
                return res.status(400).json({ error: 'Voucher code already exists' });
            }
            const voucher = await db_1.db.voucher.create({
                data: {
                    code: code.toUpperCase(),
                    rewardAmount: Number(rewardAmount),
                    maxUses: Number(maxUses),
                }
            });
            res.json({ success: true, voucher });
        }
        catch (error) {
            console.error('Create voucher error:', error);
            res.status(500).json({ error: error.message });
        }
    }
    static async deleteVoucher(req, res) {
        try {
            const id = req.params.id;
            // Cascade delete claims to avoid foreign key errors
            await db_1.db.voucherClaim.deleteMany({ where: { voucherId: id } });
            await db_1.db.voucher.delete({ where: { id } });
            res.json({ success: true });
        }
        catch (error) {
            console.error('Delete voucher error:', error);
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
    static async getUser(req, res) {
        try {
            const id = req.params.id;
            let user = await db_1.db.user.findUnique({
                where: { id },
                include: {
                    servers: true,
                    transactions: {
                        orderBy: { timestamp: 'desc' },
                        take: 10
                    }
                }
            }).catch(() => null);
            if (!user) {
                user = await db_1.db.user.findUnique({
                    where: { discordId: id },
                    include: {
                        servers: true,
                        transactions: {
                            orderBy: { timestamp: 'desc' },
                            take: 10
                        }
                    }
                }).catch(() => null);
            }
            if (!user) {
                user = await db_1.db.user.findFirst({
                    where: { username: id },
                    include: {
                        servers: true,
                        transactions: {
                            orderBy: { timestamp: 'desc' },
                            take: 10
                        }
                    }
                }).catch(() => null);
            }
            if (!user)
                return res.status(404).json({ error: 'User not found' });
            res.json(user);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async globalSearch(req, res) {
        try {
            const q = req.query.q;
            if (!q || q.length < 2)
                return res.json({ users: [], servers: [], tickets: [], logs: [] });
            const [users, servers, tickets, logs] = await Promise.all([
                db_1.db.user.findMany({
                    where: {
                        OR: [
                            { username: { contains: q } },
                            { email: { contains: q } },
                            { discordId: { contains: q } }
                        ]
                    },
                    select: { id: true, username: true, email: true },
                    take: 5
                }),
                db_1.db.server.findMany({
                    where: {
                        OR: [
                            { name: { contains: q } },
                            { id: { contains: q } },
                            { user: { username: { contains: q } } }
                        ]
                    },
                    include: { user: { select: { username: true } } },
                    take: 5
                }),
                db_1.db.supportTicket.findMany({
                    where: {
                        OR: [
                            { subject: { contains: q } },
                            { user: { username: { contains: q } } }
                        ]
                    },
                    include: { user: { select: { username: true } } },
                    take: 5
                }),
                db_1.db.auditLog.findMany({
                    where: {
                        OR: [
                            { action: { contains: q } },
                            { resource: { contains: q } }
                        ]
                    },
                    take: 5
                })
            ]);
            res.json({ users, servers, tickets, logs });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getNotifications(req, res) {
        try {
            const dismissedSetting = await db_1.db.setting.findUnique({ where: { key: 'admin_dismissed_notifs' } });
            let dismissedIds = [];
            if (dismissedSetting && dismissedSetting.value) {
                try {
                    dismissedIds = JSON.parse(dismissedSetting.value);
                }
                catch (e) { }
            }
            const dismissedSet = new Set(dismissedIds);
            const [tickets, orders, failedJobs, logs] = await Promise.all([
                db_1.db.supportTicket.findMany({ where: { status: 'OPEN' }, include: { user: { select: { username: true } } } }),
                db_1.db.premiumOrder.findMany({ where: { status: 'PENDING' }, include: { user: { select: { username: true } } } }),
                db_1.db.queueJob.findMany({ where: { status: 'FAILED' }, include: { user: { select: { username: true } } } }),
                db_1.db.auditLog.findMany({ where: { action: { in: ['ERROR', 'CRITICAL', 'SERVER_CREATE_FAILED'] } }, orderBy: { timestamp: 'desc' }, take: 20 })
            ]);
            const notifications = [];
            tickets.forEach(t => {
                const id = `ticket_${t.id}`;
                if (!dismissedSet.has(id))
                    notifications.push({ id, title: 'Open Support Ticket', message: `${t.user?.username} opened a ticket: ${t.subject}`, time: t.createdAt, link: '/admin/support', type: 'ticket' });
            });
            orders.forEach(o => {
                const id = `order_${o.id}`;
                if (!dismissedSet.has(id))
                    notifications.push({ id, title: 'Pending Premium Order', message: `${o.user?.username} placed a premium order.`, time: o.createdAt, link: '/admin/premium', type: 'order' });
            });
            failedJobs.forEach(j => {
                const id = `job_${j.id}`;
                if (!dismissedSet.has(id))
                    notifications.push({ id, title: 'Failed Queue Job', message: `Job ${j.action} failed for ${j.user?.username}.`, time: j.updatedAt, link: '/admin/queue', type: 'job' });
            });
            logs.forEach(l => {
                const id = `log_${l.id}`;
                if (!dismissedSet.has(id))
                    notifications.push({ id, title: 'System Error', message: `Action: ${l.action} ${l.resource ? '- ' + l.resource : ''}`, time: l.timestamp, link: '/admin/logs', type: 'log' });
            });
            notifications.sort((a, b) => b.time.getTime() - a.time.getTime());
            res.json(notifications);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async markNotificationRead(req, res) {
        try {
            const id = req.params.id;
            if (!id)
                return res.status(400).json({ error: 'ID required' });
            const dismissedSetting = await db_1.db.setting.findUnique({ where: { key: 'admin_dismissed_notifs' } });
            let dismissedIds = [];
            if (dismissedSetting && dismissedSetting.value) {
                try {
                    dismissedIds = JSON.parse(dismissedSetting.value);
                }
                catch (e) { }
            }
            if (!dismissedIds.includes(id)) {
                dismissedIds.unshift(id);
                if (dismissedIds.length > 500)
                    dismissedIds = dismissedIds.slice(0, 500);
                await db_1.db.setting.upsert({
                    where: { key: 'admin_dismissed_notifs' },
                    update: { value: JSON.stringify(dismissedIds) },
                    create: { key: 'admin_dismissed_notifs', value: JSON.stringify(dismissedIds), description: 'Dismissed admin notifications' }
                });
            }
            res.json({ success: true });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async markAllNotificationsRead(req, res) {
        try {
            const { ids } = req.body;
            if (!ids || !Array.isArray(ids))
                return res.status(400).json({ error: 'Array of ids required' });
            const dismissedSetting = await db_1.db.setting.findUnique({ where: { key: 'admin_dismissed_notifs' } });
            let dismissedIds = [];
            if (dismissedSetting && dismissedSetting.value) {
                try {
                    dismissedIds = JSON.parse(dismissedSetting.value);
                }
                catch (e) { }
            }
            let updated = false;
            ids.forEach(id => {
                if (!dismissedIds.includes(id)) {
                    dismissedIds.unshift(id);
                    updated = true;
                }
            });
            if (updated) {
                if (dismissedIds.length > 500)
                    dismissedIds = dismissedIds.slice(0, 500);
                await db_1.db.setting.upsert({
                    where: { key: 'admin_dismissed_notifs' },
                    update: { value: JSON.stringify(dismissedIds) },
                    create: { key: 'admin_dismissed_notifs', value: JSON.stringify(dismissedIds), description: 'Dismissed admin notifications' }
                });
            }
            res.json({ success: true });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.AdminCoreController = AdminCoreController;

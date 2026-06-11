"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminQueueService = exports.QueueService = exports.worker = exports.serverQueue = void 0;
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const db_1 = require("../utils/db");
const billing_service_1 = require("./billing.service");
const pterodactyl_service_1 = require("./pterodactyl.service");
const settings_service_1 = require("./settings.service");
const notification_service_1 = require("./notification.service");
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const connection = new ioredis_1.default(redisUrl, { maxRetriesPerRequest: null });
exports.serverQueue = new bullmq_1.Queue('server-queue', { connection: connection });
// Helper to calculate priority
const getPriority = async (userId) => {
    const user = await db_1.db.user.findUnique({
        where: { id: userId },
        include: { premiumOrders: { where: { status: 'COMPLETED' } } },
    });
    if (user?.premiumOrders && user.premiumOrders.length > 0) {
        return await settings_service_1.SettingsService.getNumber('premiumQueuePriority');
    }
    return await settings_service_1.SettingsService.getNumber('freeQueuePriority');
};
// Initialize Worker (max 5 starting servers at a time)
exports.worker = new bullmq_1.Worker('server-queue', async (job) => {
    const { queueJobId, serverId, action } = job.data;
    // Mark job and server as STARTING/RESTARTING
    const status = action === 'START' ? 'STARTING' : 'RESTARTING';
    await db_1.db.queueJob.update({
        where: { id: queueJobId },
        data: { status },
    });
    const server = await db_1.db.server.findUnique({ where: { id: serverId } });
    if (!server)
        return;
    // Power on Pterodactyl
    if (server.pterodactylIdentifier) {
        if (action === 'START') {
            await pterodactyl_service_1.PterodactylService.startServer(server.pterodactylIdentifier);
        }
        else if (action === 'RESTART') {
            await pterodactyl_service_1.PterodactylService.restartServer(server.pterodactylIdentifier);
        }
    }
    // Simulate Pterodactyl server start (60-120 seconds) wait time for boot up
    const delay = Math.floor(Math.random() * (120000 - 60000 + 1) + 60000);
    // Yield execution to not block Node thread
    await new Promise(resolve => setTimeout(resolve, delay));
    // Try to deduct initial cost before completing
    const billed = await billing_service_1.BillingService.deductCost(serverId, 'INITIAL_START');
    if (!billed) {
        await db_1.db.queueJob.update({
            where: { id: queueJobId },
            data: { status: 'FAILED' },
        });
        // Stop server aggressively if billing fails immediately after boot
        if (server.pterodactylIdentifier) {
            await pterodactyl_service_1.PterodactylService.stopServer(server.pterodactylIdentifier);
        }
        return;
    }
    // Mark completed
    await db_1.db.queueJob.update({
        where: { id: queueJobId },
        data: { status: 'COMPLETED' },
    });
    await db_1.db.server.update({
        where: { id: serverId },
        data: { status: 'RUNNING' },
    });
    const queueJob = await db_1.db.queueJob.findUnique({ where: { id: queueJobId } });
    if (queueJob) {
        await notification_service_1.NotificationService.createNotification(queueJob.userId, `Server ${action === 'START' ? 'Started' : 'Restarted'}`, `Your server is now RUNNING.`, 'SERVER_START');
    }
}, { connection: connection, concurrency: 5 });
// Auto-sync concurrency on start
settings_service_1.SettingsService.getNumber('queueConcurrency').then(concurrency => {
    exports.worker.concurrency = concurrency;
    console.log(`[QueueService] Allocator initialized with concurrency: ${concurrency}`);
}).catch(err => console.error(err));
exports.worker.on('failed', async (job, err) => {
    if (job) {
        const { queueJobId, serverId } = job.data;
        await db_1.db.queueJob.update({
            where: { id: queueJobId },
            data: { status: 'FAILED' },
        });
        await db_1.db.server.update({
            where: { id: serverId },
            data: { status: 'STOPPED' }, // Revert to stopped
        });
        console.error(`Job ${job.id} failed:`, err);
    }
});
class QueueService {
    static async addStartJob(userId, serverId) {
        const priority = await getPriority(userId);
        // Create DB Record
        const queueJob = await db_1.db.queueJob.create({
            data: {
                userId,
                serverId,
                action: 'START',
                status: 'WAITING',
                priority,
            }
        });
        const job = await exports.serverQueue.add('start-server', {
            queueJobId: queueJob.id,
            serverId,
            action: 'START'
        }, { priority });
        await notification_service_1.NotificationService.createNotification(userId, 'Server Queued', `Your server start request is in queue.`, 'QUEUE_UPDATE');
        return { queueJob, bullJobId: job.id };
    }
    static async addRestartJob(userId, serverId) {
        const priority = await getPriority(userId);
        const queueJob = await db_1.db.queueJob.create({
            data: {
                userId,
                serverId,
                action: 'RESTART',
                status: 'WAITING',
                priority,
            }
        });
        const job = await exports.serverQueue.add('restart-server', {
            queueJobId: queueJob.id,
            serverId,
            action: 'RESTART'
        }, { priority });
        return { queueJob, bullJobId: job.id };
    }
    static async stopServer(userId, serverId) {
        // Bypasses Queue completely, happens instantly
        const server = await db_1.db.server.findUnique({ where: { id: serverId } });
        if (server?.pterodactylIdentifier) {
            await pterodactyl_service_1.PterodactylService.stopServer(server.pterodactylIdentifier);
        }
        await db_1.db.server.update({
            where: { id: serverId },
            data: { status: 'STOPPED' }
        });
        await notification_service_1.NotificationService.createNotification(userId, 'Server Stopped', `Your server has been stopped.`, 'SERVER_STOP');
        return { success: true, message: 'Server stopped instantly' };
    }
    static async getMyJobs(userId) {
        return await db_1.db.queueJob.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20
        });
    }
    static async getStatus(serverId) {
        const activeJob = await db_1.db.queueJob.findFirst({
            where: { serverId, status: { in: ['WAITING', 'PROCESSING', 'STARTING', 'RESTARTING'] } }
        });
        if (!activeJob)
            return { status: 'NONE' };
        // Calculate position if waiting
        if (activeJob.status === 'WAITING') {
            const waitingJobs = await exports.serverQueue.getWaiting();
            const position = waitingJobs.findIndex(j => j.data.queueJobId === activeJob.id) + 1;
            return { ...activeJob, queuePosition: position };
        }
        return activeJob;
    }
}
exports.QueueService = QueueService;
class AdminQueueService {
    static async pauseQueue() {
        await exports.serverQueue.pause();
        return { status: 'paused' };
    }
    static async resumeQueue() {
        await exports.serverQueue.resume();
        return { status: 'running' };
    }
    static async cancelJob(bullJobId) {
        const job = await exports.serverQueue.getJob(bullJobId);
        if (job) {
            await job.remove();
            await db_1.db.queueJob.update({
                where: { id: job.data.queueJobId },
                data: { status: 'CANCELLED' }
            });
            return { success: true };
        }
        throw new Error('Job not found');
    }
    static async retryJob(bullJobId) {
        const job = await exports.serverQueue.getJob(bullJobId);
        if (job) {
            await job.retry();
            return { success: true };
        }
        throw new Error('Job not found');
    }
    static async getActiveSlots() {
        const activeJobs = await exports.serverQueue.getActive();
        const isPaused = await exports.serverQueue.isPaused();
        // Enrich with DB data
        const active = await Promise.all(activeJobs.map(async (job) => {
            const qj = await db_1.db.queueJob.findUnique({
                where: { id: job.data.queueJobId },
                include: { user: true, server: true }
            });
            return {
                id: job.id,
                name: qj?.server?.name || job.name,
                owner: qj?.user?.username || 'Unknown',
                action: job.data.action,
                progress: job.progress || 50,
            };
        }));
        const max = exports.worker.concurrency;
        return { active, max, isPaused };
    }
    static async getWaitingJobs() {
        const waitingJobs = await exports.serverQueue.getWaiting();
        // Enrich with DB data
        const waiting = await Promise.all(waitingJobs.map(async (job) => {
            const qj = await db_1.db.queueJob.findUnique({
                where: { id: job.data.queueJobId },
                include: { user: true, server: true }
            });
            return {
                id: job.id,
                name: qj?.server?.name || job.name,
                owner: qj?.user?.username || 'Unknown',
                action: job.data.action,
                priority: job.opts.priority
            };
        }));
        return waiting;
    }
    static async checkHealth() {
        try {
            await connection.ping();
            return { redis: 'ok', queue: 'ok' }; // BullMQ will fail if Redis fails
        }
        catch (error) {
            return { redis: 'error', queue: 'error', message: error.message };
        }
    }
}
exports.AdminQueueService = AdminQueueService;

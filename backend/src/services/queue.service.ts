import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { db } from '../utils/db';
import { BillingService } from './billing.service';
import { PterodactylService } from './pterodactyl.service';
import { SettingsService } from './settings.service';
import { NotificationService } from './notification.service';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null });

export const serverQueue = new Queue('server-queue', { connection: connection as any });

// Helper to calculate priority
const getPriority = async (userId: string) => {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { premiumOrders: { where: { status: 'COMPLETED' } } },
  });
  
  if (user?.premiumOrders && user.premiumOrders.length > 0) {
    return await SettingsService.getNumber('premiumQueuePriority');
  }
  return await SettingsService.getNumber('freeQueuePriority');
};

// Initialize Worker (max 5 starting servers at a time)
export const worker = new Worker('server-queue', async (job: Job) => {
  const { queueJobId, serverId, action } = job.data;
  
  // Mark job and server as STARTING/RESTARTING
  const status = action === 'START' ? 'STARTING' : 'RESTARTING';
  
  await db.queueJob.update({
    where: { id: queueJobId },
    data: { status },
  });

  const server = await db.server.findUnique({ where: { id: serverId } });
  if (!server) return;

  const owner = await db.user.findUnique({ where: { id: server.userId } });
  if (!owner || owner.balance <= 0) {
    console.log(`[CREDITS] Insufficient balance blocked start (Queue Worker)`);
    await db.queueJob.update({
      where: { id: queueJobId },
      data: { status: 'FAILED' },
    });
    await db.server.update({
      where: { id: serverId },
      data: { status: 'STOPPED' },
    });
    return;
  }

  // Power on Pterodactyl
  if (server.pterodactylIdentifier) {
    if (action === 'START') {
      await PterodactylService.startServer(server.pterodactylIdentifier);
    } else if (action === 'RESTART') {
      await PterodactylService.restartServer(server.pterodactylIdentifier);
    }
  }

  // Simulate Pterodactyl server start (60-120 seconds) wait time for boot up
  const delay = Math.floor(Math.random() * (120000 - 60000 + 1) + 60000);
  
  // Yield execution to not block Node thread
  await new Promise(resolve => setTimeout(resolve, delay));

  // Try to deduct initial cost before completing
  const billed = await BillingService.deductCost(serverId, 'INITIAL_START');

  if (!billed) {
    await db.queueJob.update({
      where: { id: queueJobId },
      data: { status: 'FAILED' },
    });
    
    // Stop server aggressively if billing fails immediately after boot
    if (server.pterodactylIdentifier) {
      await PterodactylService.stopServer(server.pterodactylIdentifier);
    }
    return;
  }

  // Mark completed
  await db.queueJob.update({
    where: { id: queueJobId },
    data: { status: 'COMPLETED' },
  });

  await db.server.update({
    where: { id: serverId },
    data: { status: 'RUNNING' },
  });

  const queueJob = await db.queueJob.findUnique({ where: { id: queueJobId }});
  if (queueJob) {
    await NotificationService.createNotification(
      queueJob.userId,
      `Server ${action === 'START' ? 'Started' : 'Restarted'}`,
      `Your server is now RUNNING.`,
      'SERVER_START'
    );
  }

}, { connection: connection as any, concurrency: 5 });

// Auto-sync concurrency on start
SettingsService.getNumber('queueConcurrency').then(concurrency => {
  worker.concurrency = concurrency;
  console.log(`[QueueService] Allocator initialized with concurrency: ${concurrency}`);
}).catch(err => console.error(err));

worker.on('failed', async (job, err) => {
  if (job) {
    const { queueJobId, serverId } = job.data;
    await db.queueJob.update({
      where: { id: queueJobId },
      data: { status: 'FAILED' },
    });
    await db.server.update({
      where: { id: serverId },
      data: { status: 'STOPPED' }, // Revert to stopped
    });
    console.error(`Job ${job.id} failed:`, err);
  }
});

export class QueueService {
  public static async addStartJob(userId: string, serverId: string) {
    const priority = await getPriority(userId);
    
    // Create DB Record
    const queueJob = await db.queueJob.create({
      data: {
        userId,
        serverId,
        action: 'START',
        status: 'WAITING',
        priority,
      }
    });

    const job = await serverQueue.add('start-server', {
      queueJobId: queueJob.id,
      serverId,
      action: 'START'
    }, { priority });

    await NotificationService.createNotification(
      userId,
      'Server Queued',
      `Your server start request is in queue.`,
      'QUEUE_UPDATE'
    );

    return { queueJob, bullJobId: job.id };
  }

  public static async addRestartJob(userId: string, serverId: string) {
    const priority = await getPriority(userId);
    
    const queueJob = await db.queueJob.create({
      data: {
        userId,
        serverId,
        action: 'RESTART',
        status: 'WAITING',
        priority,
      }
    });

    const job = await serverQueue.add('restart-server', {
      queueJobId: queueJob.id,
      serverId,
      action: 'RESTART'
    }, { priority });

    return { queueJob, bullJobId: job.id };
  }

  public static async stopServer(userId: string, serverId: string) {
    // Bypasses Queue completely, happens instantly
    const server = await db.server.findUnique({ where: { id: serverId } });
    if (server?.pterodactylIdentifier) {
      await PterodactylService.stopServer(server.pterodactylIdentifier);
    }

    await db.server.update({
      where: { id: serverId },
      data: { status: 'STOPPED' }
    });

    await NotificationService.createNotification(
      userId,
      'Server Stopped',
      `Your server has been stopped.`,
      'SERVER_STOP'
    );

    return { success: true, message: 'Server stopped instantly' };
  }

  public static async getMyJobs(userId: string) {
    return await db.queueJob.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
  }

  public static async getStatus(serverId: string) {
    const activeJob = await db.queueJob.findFirst({
      where: { serverId, status: { in: ['WAITING', 'PROCESSING', 'STARTING', 'RESTARTING'] } }
    });

    if (!activeJob) return { status: 'NONE' };

    // Calculate position if waiting
    if (activeJob.status === 'WAITING') {
      const waitingJobs = await serverQueue.getWaiting();
      const position = waitingJobs.findIndex(j => j.data.queueJobId === activeJob.id) + 1;
      return { ...activeJob, queuePosition: position };
    }

    return activeJob;
  }
}

export class AdminQueueService {
  public static async pauseQueue() {
    await serverQueue.pause();
    return { status: 'paused' };
  }

  public static async resumeQueue() {
    await serverQueue.resume();
    return { status: 'running' };
  }

  public static async cancelJob(bullJobId: string) {
    const job = await serverQueue.getJob(bullJobId);
    if (job) {
      await job.remove();
      await db.queueJob.update({
        where: { id: job.data.queueJobId },
        data: { status: 'CANCELLED' }
      });
      return { success: true };
    }
    throw new Error('Job not found');
  }

  public static async retryJob(bullJobId: string) {
    const job = await serverQueue.getJob(bullJobId);
    if (job) {
      await job.retry();
      return { success: true };
    }
    throw new Error('Job not found');
  }

  public static async getActiveSlots() {
    const activeJobs = await serverQueue.getActive();
    const isPaused = await serverQueue.isPaused();
    
    // Enrich with DB data
    const active = await Promise.all(activeJobs.map(async (job) => {
      const qj = await db.queueJob.findUnique({
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

    const max = worker.concurrency;
    return { active, max, isPaused };
  }

  public static async getWaitingJobs() {
    const waitingJobs = await serverQueue.getWaiting();
    
    // Enrich with DB data
    const waiting = await Promise.all(waitingJobs.map(async (job) => {
      const qj = await db.queueJob.findUnique({
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

  public static async checkHealth() {
    try {
      await connection.ping();
      return { redis: 'ok', queue: 'ok' }; // BullMQ will fail if Redis fails
    } catch (error: any) {
      return { redis: 'error', queue: 'error', message: error.message };
    }
  }
}

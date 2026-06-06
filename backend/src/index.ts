import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { validateEnv } from './utils/env';

dotenv.config();
validateEnv();

const app = express();
app.set("trust proxy", 1);
const port = process.env.PORT || 5000;

import { securityHeaders, authLimiter, voucherLimiter, creditsLimiter, ticketLimiter, adminLimiter } from './middleware/security';
import { globalErrorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/logger';
import { db } from './utils/db';
import { AdminQueueService } from './services/queue.service';
import { PterodactylService } from './services/pterodactyl.service';

app.use(securityHeaders);
app.use(requestLogger);
app.use(cors());
app.use(express.json());

import creditsRoutes from './routes/credits.routes';
import voucherRoutes from './routes/voucher.routes';
import referralRoutes from './routes/referral.routes';
import authRoutes from './routes/auth.routes';
import serverRoutes from './routes/server.routes';
import adminServerRoutes from './routes/admin.server.routes';
import queueRoutes from './routes/queue.routes';
import adminQueueRoutes from './routes/admin.queue.routes';
import adminBillingRoutes from './routes/admin.billing.routes';
import notificationRoutes from './routes/notification.routes';
import adminSettingsRoutes from './routes/admin.settings.routes';
import supportRoutes from './routes/support.routes';
import adminSupportRoutes from './routes/admin.support.routes';

app.use('/auth', authLimiter, authRoutes);
app.use('/servers', serverRoutes);
app.use('/admin/servers', adminLimiter, adminServerRoutes);
app.use('/credits', creditsLimiter, creditsRoutes);
app.use('/vouchers', voucherLimiter, voucherRoutes);
app.use('/referrals', referralRoutes);
app.use('/queue', queueRoutes);
app.use('/admin/queue', adminLimiter, adminQueueRoutes);
app.use('/admin/billing', adminLimiter, adminBillingRoutes);
app.use('/notifications', notificationRoutes);
app.use('/admin/settings', adminLimiter, adminSettingsRoutes);
app.use('/support/tickets', ticketLimiter, supportRoutes);
app.use('/admin/support/tickets', adminLimiter, adminSupportRoutes);

app.get('/health', async (req: Request, res: Response) => {
  try {
    // Check Database
    await db.$queryRaw`SELECT 1`;
    const dbStatus = 'ok';

    // Check Redis & Queue
    const queueHealth = await AdminQueueService.checkHealth();

    // Check Pterodactyl
    const pteroHealth = await PterodactylService.checkConnection();

    const isHealthy = dbStatus === 'ok' && queueHealth.redis === 'ok';

    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
        redis: queueHealth.redis,
        queue: queueHealth.queue,
        pterodactyl: pteroHealth.status
      }
    });
  } catch (error: any) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      message: error.message
    });
  }
});

app.use(globalErrorHandler);

import cron from 'node-cron';
import { BillingService } from './services/billing.service';
import { SettingsService } from './services/settings.service';

// Start hourly billing cron job (runs every minute to check timestamps)
cron.schedule('* * * * *', () => {
  BillingService.processHourlyBilling();
});

const startServer = async () => {
  await SettingsService.initDefaultSettings();
  console.log('Settings initialized.');
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();

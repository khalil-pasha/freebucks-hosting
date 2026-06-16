import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { validateEnv } from './utils/env';
import axios from 'axios';

dotenv.config();
validateEnv();

// Force IPv4 for all outbound requests (Pterodactyl, Discord)
// Bypasses ETIMEDOUT AggregateError caused by broken IPv6 routing to Cloudflare
axios.defaults.family = 4;

const app = express();

// Trust Cloudflare/Nginx proxies to correctly resolve req.ip
app.set("trust proxy", true);
const port = process.env.PORT || 5000;

import { securityHeaders, voucherLimiter, creditsLimiter, ticketLimiter, adminLimiter } from './middleware/security';
import { globalErrorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/logger';
import { db } from './utils/db';
import { AdminQueueService } from './services/queue.service';
import { PterodactylService } from './services/pterodactyl.service';
import { requireAdmin } from './middleware/admin';

app.use(securityHeaders);
app.use(requestLogger);

// Bulletproof CORS Configuration
const allowedOrigins = ["https://app.freebucks.host", "http://localhost:3000"];
const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cache-Control", "Pragma", "Expires"]
};
app.use(cors(corsOptions));
app.use((req, res, next) => {
  if (req.method === "OPTIONS") return cors(corsOptions)(req, res, next);
  next();
});

app.use(express.json({ limit: '10mb' }));

import path from 'path';
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

import cookieParser from 'cookie-parser';
app.use(cookieParser());

import creditsRoutes from './routes/credits.routes';
import voucherRoutes from './routes/voucher.routes';
import referralRoutes from './routes/referral.routes';
import authRoutes from './routes/auth.routes';
import adminAuthRoutes from './routes/admin.auth.routes';
import serverRoutes from './routes/server.routes';
import serverPanelRoutes from './routes/server-panel.routes';
import adminServerRoutes from './routes/admin.server.routes';
import queueRoutes from './routes/queue.routes';
import adminQueueRoutes from './routes/admin.queue.routes';
import adminBillingRoutes from './routes/admin.billing.routes';
import notificationRoutes from './routes/notification.routes';
import adminSettingsRoutes from './routes/admin.settings.routes';
import supportRoutes from './routes/support.routes';
import adminSupportRoutes from './routes/admin.support.routes';
import profileRoutes from './routes/profile.routes';
import adminCoreRoutes from './routes/admin.core.routes';

// User Routes
app.use('/auth', authRoutes);
app.use('/servers', serverRoutes);
app.use('/servers/:id/panel', serverPanelRoutes);
app.use('/credits', creditsLimiter, creditsRoutes);
app.use('/vouchers', voucherLimiter, voucherRoutes);
app.use('/referrals', referralRoutes);
app.use('/queue', queueRoutes);
app.use('/notifications', notificationRoutes);
app.use('/support/tickets', ticketLimiter, supportRoutes);
app.use('/profile', profileRoutes);

// Admin Auth (Public, but rate limited)
app.use('/admin/auth', adminLimiter, adminAuthRoutes);

// Admin Protected Routes
app.use('/admin/core', adminLimiter, requireAdmin, adminCoreRoutes);
app.use('/admin/servers', adminLimiter, requireAdmin, adminServerRoutes);
app.use('/admin/queue', adminLimiter, requireAdmin, adminQueueRoutes);
app.use('/admin/billing', adminLimiter, requireAdmin, adminBillingRoutes);
app.use('/admin/settings', adminLimiter, requireAdmin, adminSettingsRoutes);
app.use('/admin/support/tickets', adminLimiter, requireAdmin, adminSupportRoutes);

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

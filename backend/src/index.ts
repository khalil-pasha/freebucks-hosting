import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

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

app.use('/auth', authRoutes);
app.use('/servers', serverRoutes);
app.use('/admin/servers', adminServerRoutes);
app.use('/credits', creditsRoutes);
app.use('/vouchers', voucherRoutes);
app.use('/referrals', referralRoutes);
app.use('/queue', queueRoutes);
app.use('/admin/queue', adminQueueRoutes);
app.use('/admin/billing', adminBillingRoutes);
app.use('/notifications', notificationRoutes);
app.use('/admin/settings', adminSettingsRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

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

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const env_1 = require("./utils/env");
dotenv_1.default.config();
(0, env_1.validateEnv)();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
const security_1 = require("./middleware/security");
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = require("./middleware/logger");
const db_1 = require("./utils/db");
const queue_service_1 = require("./services/queue.service");
const pterodactyl_service_1 = require("./services/pterodactyl.service");
app.use(security_1.securityHeaders);
app.use(logger_1.requestLogger);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const credits_routes_1 = __importDefault(require("./routes/credits.routes"));
const voucher_routes_1 = __importDefault(require("./routes/voucher.routes"));
const referral_routes_1 = __importDefault(require("./routes/referral.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const server_routes_1 = __importDefault(require("./routes/server.routes"));
const admin_server_routes_1 = __importDefault(require("./routes/admin.server.routes"));
const queue_routes_1 = __importDefault(require("./routes/queue.routes"));
const admin_queue_routes_1 = __importDefault(require("./routes/admin.queue.routes"));
const admin_billing_routes_1 = __importDefault(require("./routes/admin.billing.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const admin_settings_routes_1 = __importDefault(require("./routes/admin.settings.routes"));
const support_routes_1 = __importDefault(require("./routes/support.routes"));
const admin_support_routes_1 = __importDefault(require("./routes/admin.support.routes"));
app.use('/auth', security_1.authLimiter, auth_routes_1.default);
app.use('/servers', server_routes_1.default);
app.use('/admin/servers', security_1.adminLimiter, admin_server_routes_1.default);
app.use('/credits', security_1.creditsLimiter, credits_routes_1.default);
app.use('/vouchers', security_1.voucherLimiter, voucher_routes_1.default);
app.use('/referrals', referral_routes_1.default);
app.use('/queue', queue_routes_1.default);
app.use('/admin/queue', security_1.adminLimiter, admin_queue_routes_1.default);
app.use('/admin/billing', security_1.adminLimiter, admin_billing_routes_1.default);
app.use('/notifications', notification_routes_1.default);
app.use('/admin/settings', security_1.adminLimiter, admin_settings_routes_1.default);
app.use('/support/tickets', security_1.ticketLimiter, support_routes_1.default);
app.use('/admin/support/tickets', security_1.adminLimiter, admin_support_routes_1.default);
app.get('/health', async (req, res) => {
    try {
        // Check Database
        await db_1.db.$queryRaw `SELECT 1`;
        const dbStatus = 'ok';
        // Check Redis & Queue
        const queueHealth = await queue_service_1.AdminQueueService.checkHealth();
        // Check Pterodactyl
        const pteroHealth = await pterodactyl_service_1.PterodactylService.checkConnection();
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
    }
    catch (error) {
        res.status(503).json({
            status: 'error',
            timestamp: new Date().toISOString(),
            message: error.message
        });
    }
});
app.use(errorHandler_1.globalErrorHandler);
const node_cron_1 = __importDefault(require("node-cron"));
const billing_service_1 = require("./services/billing.service");
const settings_service_1 = require("./services/settings.service");
// Start hourly billing cron job (runs every minute to check timestamps)
node_cron_1.default.schedule('* * * * *', () => {
    billing_service_1.BillingService.processHourlyBilling();
});
const startServer = async () => {
    await settings_service_1.SettingsService.initDefaultSettings();
    console.log('Settings initialized.');
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};
startServer();

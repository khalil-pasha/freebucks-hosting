"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
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
app.use('/auth', auth_routes_1.default);
app.use('/servers', server_routes_1.default);
app.use('/admin/servers', admin_server_routes_1.default);
app.use('/credits', credits_routes_1.default);
app.use('/vouchers', voucher_routes_1.default);
app.use('/referrals', referral_routes_1.default);
app.use('/queue', queue_routes_1.default);
app.use('/admin/queue', admin_queue_routes_1.default);
app.use('/admin/billing', admin_billing_routes_1.default);
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
const node_cron_1 = __importDefault(require("node-cron"));
const billing_service_1 = require("./services/billing.service");
// Start hourly billing cron job (runs every minute to check timestamps)
node_cron_1.default.schedule('* * * * *', () => {
    billing_service_1.BillingService.processHourlyBilling();
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

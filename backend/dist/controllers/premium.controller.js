"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PremiumController = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const db_1 = require("../utils/db");
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});
class PremiumController {
    static async createOrder(req, res) {
        try {
            const userId = req.user.id;
            const { plan, ram, cpu, disk } = req.body || {};
            let amount = 549; // Default Premium amount
            let finalRam = 8;
            let finalCpu = 300;
            let finalDisk = 30;
            if (plan === 'custom') {
                if (!ram || !cpu || !disk) {
                    return res.status(400).json({ error: 'Missing custom plan specifications' });
                }
                if (ram < 1 || ram > 32 || cpu < 50 || cpu > 800 || disk < 5 || disk > 100) {
                    return res.status(400).json({ error: 'Invalid hardware specifications' });
                }
                finalRam = ram;
                finalCpu = cpu;
                finalDisk = disk;
                // Recalculate price on backend exactly like frontend:
                // (RAM * 30) + ((CPU / 50) * 30) + ((Disk / 5) * 10)
                amount = Math.round((ram * 30) + ((cpu / 50) * 30) + ((disk / 5) * 10));
            }
            else if (plan && plan !== 'premium' && plan !== 'Premium') {
                return res.status(400).json({ error: 'Invalid plan selected' });
            }
            const receipt = `fb_${userId.slice(-10)}_${Date.now()}`;
            console.log("[PremiumController] Receipt:", receipt, receipt.length);
            const options = {
                amount: amount * 100, // paise
                currency: 'INR',
                receipt: receipt
            };
            const order = await razorpay.orders.create(options);
            const premiumOrder = await db_1.db.premiumOrder.create({
                data: {
                    userId,
                    plan: plan === 'custom' ? 'custom' : 'Premium',
                    ram: finalRam,
                    cpu: finalCpu,
                    disk: finalDisk,
                    amount: amount,
                    razorpayOrderId: order.id,
                    status: 'PENDING'
                }
            });
            res.json({
                id: order.id,
                currency: order.currency,
                amount: order.amount,
                plan: premiumOrder.plan,
                ram: premiumOrder.ram,
                cpu: premiumOrder.cpu,
                disk: premiumOrder.disk,
                premiumOrderId: premiumOrder.id
            });
        }
        catch (error) {
            console.error('[PremiumController] createOrder Error:', error);
            const errorMessage = error?.error?.description || error?.description || error?.message || 'Failed to create payment order';
            res.status(500).json({ error: errorMessage });
        }
    }
    static async verifyPayment(req, res) {
        try {
            const userId = req.user.id;
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
            if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
                return res.status(400).json({ error: 'Missing payment details' });
            }
            const body = razorpay_order_id + '|' + razorpay_payment_id;
            const expectedSignature = crypto_1.default
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
                .update(body.toString())
                .digest('hex');
            if (expectedSignature !== razorpay_signature) {
                return res.status(400).json({ error: 'Invalid payment signature' });
            }
            // Payment is valid, check existing premium order
            const order = await db_1.db.premiumOrder.findUnique({
                where: { razorpayOrderId: razorpay_order_id }
            });
            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }
            if (order.status === 'COMPLETED') {
                return res.json({ success: true, message: 'Already processed' });
            }
            // Find if user already has an active premium subscription to extend it
            const activeOrder = await db_1.db.premiumOrder.findFirst({
                where: {
                    userId,
                    status: 'COMPLETED',
                    expiresAt: { gt: new Date() }
                },
                orderBy: { expiresAt: 'desc' }
            });
            const now = new Date();
            let newExpiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
            // If already active, extend from the current expiry date
            if (activeOrder && activeOrder.expiresAt) {
                newExpiresAt = new Date(activeOrder.expiresAt.getTime() + 30 * 24 * 60 * 60 * 1000);
            }
            await db_1.db.premiumOrder.update({
                where: { id: order.id },
                data: {
                    status: 'COMPLETED',
                    razorpayPaymentId: razorpay_payment_id,
                    startsAt: now,
                    expiresAt: newExpiresAt,
                    processedAt: now
                }
            });
            res.json({ success: true });
        }
        catch (error) {
            console.error('[PremiumController] verifyPayment Error:', error);
            res.status(500).json({ error: 'Failed to verify payment' });
        }
    }
    static async status(req, res) {
        try {
            const userId = req.user.id;
            const activeOrder = await db_1.db.premiumOrder.findFirst({
                where: {
                    userId,
                    status: 'COMPLETED',
                    expiresAt: { gt: new Date() }
                },
                orderBy: { expiresAt: 'desc' }
            });
            res.json({
                isPremium: !!activeOrder,
                expiresAt: activeOrder?.expiresAt || null
            });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch premium status' });
        }
    }
}
exports.PremiumController = PremiumController;

import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { db } from '../utils/db';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export class PremiumController {
  public static async createOrder(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      
      const receipt = `fb_${userId.slice(-10)}_${Date.now()}`;
      console.log("[PremiumController] Receipt:", receipt, receipt.length);

      const options = {
        amount: 549 * 100, // paise
        currency: 'INR',
        receipt: receipt
      };

      const order = await razorpay.orders.create(options);

      const premiumOrder = await db.premiumOrder.create({
        data: {
          userId,
          amount: 549,
          razorpayOrderId: order.id,
          status: 'PENDING'
        }
      });

      res.json({
        id: order.id,
        currency: order.currency,
        amount: order.amount,
        premiumOrderId: premiumOrder.id
      });
    } catch (error: any) {
      console.error('[PremiumController] createOrder Error:', error);
      const errorMessage = error?.error?.description || error?.description || error?.message || 'Failed to create payment order';
      res.status(500).json({ error: errorMessage });
    }
  }

  public static async verifyPayment(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ error: 'Missing payment details' });
      }

      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
        .update(body.toString())
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ error: 'Invalid payment signature' });
      }

      // Payment is valid, check existing premium order
      const order = await db.premiumOrder.findUnique({
        where: { razorpayOrderId: razorpay_order_id }
      });

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      if (order.status === 'COMPLETED') {
        return res.json({ success: true, message: 'Already processed' });
      }

      // Find if user already has an active premium subscription to extend it
      const activeOrder = await db.premiumOrder.findFirst({
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

      await db.premiumOrder.update({
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
    } catch (error: any) {
      console.error('[PremiumController] verifyPayment Error:', error);
      res.status(500).json({ error: 'Failed to verify payment' });
    }
  }

  public static async status(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const activeOrder = await db.premiumOrder.findFirst({
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
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch premium status' });
    }
  }
}

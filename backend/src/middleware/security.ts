import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// Global helmet config
export const securityHeaders = helmet();

// Auth: 5 requests / 15 minutes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many authentication attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Voucher: 10 requests / 15 minutes
export const voucherLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many voucher redemption attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Credits: 30 requests / 15 minutes
export const creditsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Too many credits requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Tickets: 20 requests / 15 minutes
export const ticketLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many ticket requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Admin routes: 30 requests / 15 minutes
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Too many admin requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

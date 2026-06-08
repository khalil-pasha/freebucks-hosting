import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// Global helmet config
export const securityHeaders = helmet();

// Lightweight auth limiter for endpoints like /auth/discord and /auth/me (100 requests / 1 minute)
export const generalAuthLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return (req.headers['cf-connecting-ip'] as string) || 
           (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || 
           req.ip || 
           'unknown';
  },
  handler: (req, res) => {
    if (req.originalUrl.includes('/discord')) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/?error=RateLimited`);
    }
    return res.status(429).json({ error: 'Too many authentication requests, please try again later' });
  }
});

// Sensitive auth limiter for /discord/callback or logins (30 requests / 1 minute)
export const sensitiveAuthLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return (req.headers['cf-connecting-ip'] as string) || 
           (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || 
           req.ip || 
           'unknown';
  },
  handler: (req, res) => {
    if (req.originalUrl.includes('/discord')) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/?error=RateLimited`);
    }
    return res.status(429).json({ error: 'Too many authentication attempts, please try again after 1 minute' });
  }
});

// Voucher: 10 requests / 15 minutes
export const voucherLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many voucher redemption attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Credits: 100 requests / 1 minute to allow dashboard navigation
export const creditsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: { error: 'Too many credits requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return (req.headers['cf-connecting-ip'] as string) || 
           (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || 
           req.ip || 
           'unknown';
  }
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

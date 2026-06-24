import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import helmet from 'helmet';

// Global helmet config
export const securityHeaders = helmet();

export const customKeyGenerator = (req: any) => {
  const ip = (req.headers['cf-connecting-ip'] as string) || req.ip || req.socket?.remoteAddress || 'unknown';
  return ipKeyGenerator(ip);
};


// Lightweight auth limiter for endpoints like /auth/discord and /auth/me (100 requests / 1 minute)
export const generalAuthLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: customKeyGenerator,
  handler: (req, res) => {
    if (req.originalUrl.includes('/discord')) {
      const frontendUrl = process.env.FRONTEND_URL || 'https://app.freebucks.host';
      return res.redirect(`${frontendUrl}/?error=RateLimited`);
    }
    return res.status(429).json({ error: 'Too many authentication requests, please try again later' });
  }
});

export const sensitiveAuthLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: customKeyGenerator,
  handler: (req, res) => {
    if (req.originalUrl.includes('/discord')) {
      const frontendUrl = process.env.FRONTEND_URL || 'https://app.freebucks.host';
      return res.redirect(`${frontendUrl}/?error=RateLimited`);
    }
    return res.status(429).json({ error: 'Too many authentication attempts, please try again after 1 minute' });
  }
});

export const voucherLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many voucher redemption attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: customKeyGenerator,
});

export const creditsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: { error: 'Too many credits requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: customKeyGenerator
});

export const supportApiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Allow high polling rate (40/min expected for single user)
  message: { error: 'Too many support API requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: customKeyGenerator,
});

export const ticketCreationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { error: 'You can create up to 5 support tickets per hour. Please wait before creating another ticket.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: customKeyGenerator,
});

export const adminLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: { error: 'Too many admin requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: customKeyGenerator
});

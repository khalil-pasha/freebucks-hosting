"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLimiter = exports.ticketLimiter = exports.creditsLimiter = exports.voucherLimiter = exports.sensitiveAuthLimiter = exports.generalAuthLimiter = exports.securityHeaders = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
// Global helmet config
exports.securityHeaders = (0, helmet_1.default)();
// Lightweight auth limiter for endpoints like /auth/discord and /auth/me (100 requests / 1 minute)
exports.generalAuthLimiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.headers['cf-connecting-ip'] || req.ip || 'unknown';
    },
    handler: (req, res) => {
        if (req.originalUrl.includes('/discord')) {
            const frontendUrl = process.env.FRONTEND_URL || 'https://app.freebucks.host';
            return res.redirect(`${frontendUrl}/?error=RateLimited`);
        }
        return res.status(429).json({ error: 'Too many authentication requests, please try again later' });
    }
});
// Sensitive auth limiter for /discord/callback or logins (30 requests / 1 minute)
exports.sensitiveAuthLimiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.headers['cf-connecting-ip'] || req.ip || 'unknown';
    },
    handler: (req, res) => {
        if (req.originalUrl.includes('/discord')) {
            const frontendUrl = process.env.FRONTEND_URL || 'https://app.freebucks.host';
            return res.redirect(`${frontendUrl}/?error=RateLimited`);
        }
        return res.status(429).json({ error: 'Too many authentication attempts, please try again after 1 minute' });
    }
});
// Voucher: 10 requests / 15 minutes
exports.voucherLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Too many voucher redemption attempts, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});
// Credits: 100 requests / 1 minute to allow dashboard navigation
exports.creditsLimiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 100,
    message: { error: 'Too many credits requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.headers['cf-connecting-ip'] || req.ip || 'unknown';
    }
});
// Tickets: 20 requests / 15 minutes
exports.ticketLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { error: 'Too many ticket requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});
// Admin routes: 100 requests / 1 minute (Increased to prevent aggressive lockouts on dashboard)
exports.adminLimiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 100,
    message: { error: 'Too many admin requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.headers['cf-connecting-ip'] || req.ip || 'unknown';
    }
});

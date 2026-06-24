"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLimiter = exports.ticketCreationLimiter = exports.supportApiLimiter = exports.creditsLimiter = exports.voucherLimiter = exports.sensitiveAuthLimiter = exports.generalAuthLimiter = exports.customKeyGenerator = exports.securityHeaders = void 0;
const express_rate_limit_1 = __importStar(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
// Global helmet config
exports.securityHeaders = (0, helmet_1.default)();
const customKeyGenerator = (req) => {
    const ip = req.headers['cf-connecting-ip'] || req.ip || req.socket?.remoteAddress || 'unknown';
    return (0, express_rate_limit_1.ipKeyGenerator)(ip);
};
exports.customKeyGenerator = customKeyGenerator;
// Lightweight auth limiter for endpoints like /auth/discord and /auth/me (100 requests / 1 minute)
exports.generalAuthLimiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: exports.customKeyGenerator,
    handler: (req, res) => {
        if (req.originalUrl.includes('/discord')) {
            const frontendUrl = process.env.FRONTEND_URL || 'https://app.freebucks.host';
            return res.redirect(`${frontendUrl}/?error=RateLimited`);
        }
        return res.status(429).json({ error: 'Too many authentication requests, please try again later' });
    }
});
exports.sensitiveAuthLimiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: exports.customKeyGenerator,
    handler: (req, res) => {
        if (req.originalUrl.includes('/discord')) {
            const frontendUrl = process.env.FRONTEND_URL || 'https://app.freebucks.host';
            return res.redirect(`${frontendUrl}/?error=RateLimited`);
        }
        return res.status(429).json({ error: 'Too many authentication attempts, please try again after 1 minute' });
    }
});
exports.voucherLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Too many voucher redemption attempts, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: exports.customKeyGenerator,
});
exports.creditsLimiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 100,
    message: { error: 'Too many credits requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: exports.customKeyGenerator
});
exports.supportApiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // Allow high polling rate (40/min expected for single user)
    message: { error: 'Too many support API requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: exports.customKeyGenerator,
});
exports.ticketCreationLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message: { error: 'You can create up to 5 support tickets per hour. Please wait before creating another ticket.' },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: exports.customKeyGenerator,
});
exports.adminLimiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 100,
    message: { error: 'Too many admin requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: exports.customKeyGenerator
});

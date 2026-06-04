"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLimiter = exports.ticketLimiter = exports.creditsLimiter = exports.voucherLimiter = exports.authLimiter = exports.securityHeaders = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
// Global helmet config
exports.securityHeaders = (0, helmet_1.default)();
// Auth: 5 requests / 15 minutes
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Too many authentication attempts, please try again after 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
});
// Voucher: 10 requests / 15 minutes
exports.voucherLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Too many voucher redemption attempts, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});
// Credits: 30 requests / 15 minutes
exports.creditsLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: { error: 'Too many credits requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});
// Tickets: 20 requests / 15 minutes
exports.ticketLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { error: 'Too many ticket requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});
// Admin routes: 30 requests / 15 minutes
exports.adminLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: { error: 'Too many admin requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});

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
exports.AdminAuthController = void 0;
const db_1 = require("../utils/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
class AdminAuthController {
    static async login(req, res) {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json({ error: 'Username and password are required' });
            }
            const admin = await db_1.db.admin.findUnique({
                where: { username }
            });
            if (!admin) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const isMatch = await bcrypt_1.default.compare(password, admin.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const token = jsonwebtoken_1.default.sign({ id: admin.id, username: admin.username, role: 'ADMIN' }, JWT_SECRET, { expiresIn: '24h' });
            const isProd = process.env.NODE_ENV === 'production';
            res.cookie('admin_token', token, {
                httpOnly: true,
                secure: isProd || true, // sameSite 'none' requires secure: true
                sameSite: 'none',
                domain: isProd ? '.freebucks.host' : undefined,
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            });
            return res.json({ success: true, message: 'Logged in successfully' });
        }
        catch (error) {
            console.error('Admin login error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    static async logout(req, res) {
        res.clearCookie('admin_token');
        return res.json({ success: true, message: 'Logged out successfully' });
    }
    static async me(req, res) {
        try {
            const token = req.cookies?.admin_token;
            if (!token) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            if (!decoded || decoded.role !== 'ADMIN') {
                return res.status(403).json({ error: 'Invalid token' });
            }
            const admin = await db_1.db.admin.findUnique({
                where: { id: decoded.id },
                select: { id: true, username: true }
            });
            if (!admin) {
                return res.status(403).json({ error: 'Admin not found' });
            }
            return res.json(admin);
        }
        catch (error) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
    }
    static async changePassword(req, res) {
        try {
            const token = req.cookies?.admin_token;
            if (!token)
                return res.status(401).json({ error: 'Not authenticated' });
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            const { currentPassword, newPassword } = req.body;
            if (!currentPassword || !newPassword)
                return res.status(400).json({ error: 'Missing required fields' });
            const admin = await db_1.db.admin.findUnique({ where: { id: decoded.id } });
            if (!admin)
                return res.status(404).json({ error: 'Admin not found' });
            const isMatch = await bcrypt_1.default.compare(currentPassword, admin.password);
            if (!isMatch)
                return res.status(401).json({ error: 'Incorrect current password' });
            const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
            await db_1.db.admin.update({
                where: { id: admin.id },
                data: { password: hashedPassword }
            });
            return res.json({ success: true, message: 'Password changed successfully' });
        }
        catch (error) {
            console.error('Change password error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    static async forgotPassword(req, res) {
        try {
            const { username } = req.body;
            if (!username)
                return res.status(400).json({ error: 'Username is required' });
            const admin = await db_1.db.admin.findFirst({ where: { username } });
            if (!admin || !admin.email) {
                // Return generic success to prevent username enumeration
                return res.json({ success: true, message: 'If the user exists and has an email, an OTP has been sent.' });
            }
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
            await db_1.db.admin.update({
                where: { id: admin.id },
                data: { resetOtp: otp, resetOtpExpiry: expiry }
            });
            const { EmailService } = await Promise.resolve().then(() => __importStar(require('../services/email.service')));
            await EmailService.sendOTP(admin.email, otp);
            return res.json({ success: true, message: 'If the user exists and has an email, an OTP has been sent.' });
        }
        catch (error) {
            console.error('Forgot password error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    static async verifyOtp(req, res) {
        try {
            const { username, otp } = req.body;
            if (!username || !otp)
                return res.status(400).json({ error: 'Username and OTP are required' });
            const admin = await db_1.db.admin.findFirst({ where: { username, resetOtp: otp } });
            if (!admin || !admin.resetOtpExpiry || admin.resetOtpExpiry < new Date()) {
                return res.status(400).json({ error: 'Invalid or expired OTP' });
            }
            const resetToken = jsonwebtoken_1.default.sign({ id: admin.id, purpose: 'RESET_PASSWORD' }, JWT_SECRET, { expiresIn: '15m' });
            return res.json({ success: true, resetToken });
        }
        catch (error) {
            console.error('Verify OTP error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    static async resetPassword(req, res) {
        try {
            const { resetToken, newPassword } = req.body;
            if (!resetToken || !newPassword)
                return res.status(400).json({ error: 'Missing required fields' });
            let decoded;
            try {
                decoded = jsonwebtoken_1.default.verify(resetToken, JWT_SECRET);
            }
            catch (err) {
                return res.status(401).json({ error: 'Invalid or expired reset token' });
            }
            if (decoded.purpose !== 'RESET_PASSWORD')
                return res.status(403).json({ error: 'Invalid token purpose' });
            const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
            await db_1.db.admin.update({
                where: { id: decoded.id },
                data: { password: hashedPassword, resetOtp: null, resetOtpExpiry: null }
            });
            return res.json({ success: true, message: 'Password reset successfully' });
        }
        catch (error) {
            console.error('Reset password error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
exports.AdminAuthController = AdminAuthController;

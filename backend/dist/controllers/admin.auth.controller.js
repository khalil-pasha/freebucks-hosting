"use strict";
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
            res.cookie('admin_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
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
}
exports.AdminAuthController = AdminAuthController;

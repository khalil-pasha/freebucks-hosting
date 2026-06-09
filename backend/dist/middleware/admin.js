"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../utils/db");
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const requireAdmin = async (req, res, next) => {
    try {
        const token = req.cookies?.admin_token;
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: missing admin session' });
        }
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        }
        catch (e) {
            return res.status(401).json({ error: 'Unauthorized: invalid or expired admin session' });
        }
        if (!decoded || decoded.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Forbidden: Admin access required' });
        }
        const dbAdmin = await db_1.db.admin.findUnique({
            where: { id: decoded.id },
            select: { id: true }
        });
        if (!dbAdmin) {
            return res.status(403).json({ error: 'Forbidden: Admin user not found' });
        }
        // Set an admin specific property on req if needed by routes
        req.adminUser = { id: decoded.id, role: 'ADMIN' };
        next();
    }
    catch (error) {
        console.error('Admin middleware error:', error);
        return res.status(500).json({ error: 'Internal server error during authorization' });
    }
};
exports.requireAdmin = requireAdmin;

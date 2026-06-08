"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = void 0;
const db_1 = require("../utils/db");
const requireAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized: missing user context' });
        }
        const dbUser = await db_1.db.user.findUnique({
            where: { id: req.user.id },
            select: { role: true }
        });
        if (!dbUser || dbUser.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Forbidden: Admin access required' });
        }
        // Update req.user role just in case
        req.user.role = dbUser.role;
        next();
    }
    catch (error) {
        console.error('Admin middleware error:', error);
        return res.status(500).json({ error: 'Internal server error during authorization' });
    }
};
exports.requireAdmin = requireAdmin;

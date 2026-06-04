"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const db_1 = require("../utils/db");
class AuditService {
    /**
     * Logs an action to the AuditLog table.
     * Extracts IP and UserAgent from the express Request object.
     */
    static async logAction(req, action, resource, userId) {
        try {
            // In production, trust proxy might be needed to get the real IP
            const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
            const userAgent = req.get('User-Agent') || 'unknown';
            // Fallback to extracting userId from req.user if not provided
            const finalUserId = userId || (req.user ? req.user.id : null);
            await db_1.db.auditLog.create({
                data: {
                    userId: finalUserId,
                    action,
                    resource,
                    ipAddress,
                    userAgent,
                },
            });
        }
        catch (error) {
            console.error('[AuditService] Failed to log action:', error);
            // We don't throw here to prevent blocking the main request flow
        }
    }
}
exports.AuditService = AuditService;

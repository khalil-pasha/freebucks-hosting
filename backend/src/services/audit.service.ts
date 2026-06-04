import { Request } from 'express';
import { db } from '../utils/db';

export class AuditService {
  /**
   * Logs an action to the AuditLog table.
   * Extracts IP and UserAgent from the express Request object.
   */
  public static async logAction(
    req: Request,
    action: string,
    resource?: string,
    userId?: string
  ) {
    try {
      // In production, trust proxy might be needed to get the real IP
      const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
      const userAgent = req.get('User-Agent') || 'unknown';

      // Fallback to extracting userId from req.user if not provided
      const finalUserId = userId || (req.user ? req.user.id : null);

      await db.auditLog.create({
        data: {
          userId: finalUserId,
          action,
          resource,
          ipAddress,
          userAgent,
        },
      });
    } catch (error) {
      console.error('[AuditService] Failed to log action:', error);
      // We don't throw here to prevent blocking the main request flow
    }
  }
}

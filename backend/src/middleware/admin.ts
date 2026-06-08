import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../utils/db';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.admin_token;
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: missing admin session' });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ error: 'Unauthorized: invalid or expired admin session' });
    }

    if (!decoded || decoded.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    const dbAdmin = await db.admin.findUnique({
      where: { id: decoded.id },
      select: { id: true }
    });

    if (!dbAdmin) {
      return res.status(403).json({ error: 'Forbidden: Admin user not found' });
    }

    // Set an admin specific property on req if needed by routes
    (req as any).adminUser = { id: decoded.id, role: 'ADMIN' };

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({ error: 'Internal server error during authorization' });
  }
};

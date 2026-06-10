import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../utils/db';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const requireAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies?.admin_token;
    
    if (!token) {
      res.status(401).json({ error: 'Unauthorized: missing admin session' });
      return;
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      res.status(401).json({ error: 'Unauthorized: invalid or expired admin session' });
      return;
    }

    if (!decoded || decoded.role !== 'ADMIN') {
      res.status(403).json({ error: 'Forbidden: Admin access required' });
      return;
    }

    const dbAdmin = await db.admin.findUnique({
      where: { id: decoded.id },
      select: { id: true }
    });

    if (!dbAdmin) {
      res.status(403).json({ error: 'Forbidden: Admin user not found' });
      return;
    }

    // Set an admin specific property on req if needed by routes
    (req as any).adminUser = { id: decoded.id, role: 'ADMIN' };

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ error: 'Internal server error during authorization' });
    return;
  }
};

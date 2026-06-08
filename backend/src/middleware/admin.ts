import { Request, Response, NextFunction } from 'express';
import { db } from '../utils/db';

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: missing user context' });
    }

    const dbUser = await db.user.findUnique({
      where: { id: req.user.id },
      select: { role: true }
    });

    if (!dbUser || dbUser.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    // Update req.user role just in case
    req.user.role = dbUser.role;

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({ error: 'Internal server error during authorization' });
  }
};

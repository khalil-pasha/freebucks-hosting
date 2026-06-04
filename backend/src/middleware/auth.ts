import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        discordId?: string;
        role?: string;
      };
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as any;
    
    req.user = { 
      id: decoded.userId,
      discordId: decoded.discordId,
      role: decoded.role
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: token is invalid or expired' });
  }
};

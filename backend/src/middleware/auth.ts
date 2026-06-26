import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../utils/db';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        discordId?: string;
        role?: string;
        sessionId?: string;
      };
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  let token: string | undefined;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.query.token && typeof req.query.token === 'string') {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: missing or invalid token' });
  }

  try {
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as any;
    
    // Check session if sessionId exists in JWT (backward compatibility check)
    if (decoded.sessionId) {
      const session = await db.userSession.findUnique({
        where: { id: decoded.sessionId }
      });

      if (!session || session.isRevoked) {
        return res.status(401).json({ error: 'Unauthorized: session revoked or invalid' });
      }

      // Update last active if more than 5 minutes have passed
      const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
      if (session.lastActive < fiveMinsAgo) {
        // Non-blocking update
        db.userSession.update({
          where: { id: session.id },
          data: { lastActive: new Date() }
        }).catch(err => console.error('Failed to update lastActive:', err));
      }
    } else {
      // Force one fresh login for old JWTs
      return res.status(401).json({ error: 'Unauthorized: please login again' });
    }

    req.user = { 
      id: decoded.userId,
      discordId: decoded.discordId,
      role: decoded.role,
      sessionId: decoded.sessionId,
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: token is invalid or expired' });
  }
};

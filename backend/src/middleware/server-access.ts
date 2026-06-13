import { Request, Response, NextFunction } from 'express';
import { db } from '../utils/db';

export const requireServerAccess = (requiredPermission?: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const serverId = req.params.id as string;
      if (!serverId) {
        return res.status(400).json({ error: 'Server ID required' });
      }

      const server = await db.server.findUnique({
        where: { id: serverId },
        include: { accesses: true }
      });

      if (!server) {
        return res.status(404).json({ error: 'Server not found' });
      }

      // Owner always has full access
      if (server.userId === req.user.id) {
        (req as any).server = server;
        return next();
      }

      // Check sub-user access
      const access = server.accesses.find(a => a.userId === req.user!.id);
      if (!access) {
        return res.status(403).json({ error: 'Forbidden. You do not have access to this server.' });
      }

      if (requiredPermission) {
        const perms = JSON.parse(access.permissions);
        if (!perms.includes(requiredPermission) && !perms.includes('admin')) {
          return res.status(403).json({ error: `Forbidden. Missing permission: ${requiredPermission}` });
        }
      }

      (req as any).server = server;
      next();
    } catch (error) {
      console.error('Server access middleware error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};

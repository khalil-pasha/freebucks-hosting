import { Request, Response } from 'express';
import { db } from '../utils/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export class AdminAuthController {
  public static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      const admin = await db.admin.findUnique({
        where: { username }
      });

      if (!admin) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: admin.id, username: admin.username, role: 'ADMIN' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.cookie('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });

      return res.json({ success: true, message: 'Logged in successfully' });
    } catch (error) {
      console.error('Admin login error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  public static async logout(req: Request, res: Response) {
    res.clearCookie('admin_token');
    return res.json({ success: true, message: 'Logged out successfully' });
  }

  public static async me(req: Request, res: Response) {
    try {
      const token = req.cookies?.admin_token;
      if (!token) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (!decoded || decoded.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Invalid token' });
      }

      const admin = await db.admin.findUnique({
        where: { id: decoded.id },
        select: { id: true, username: true }
      });

      if (!admin) {
        return res.status(403).json({ error: 'Admin not found' });
      }

      return res.json(admin);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  }
}

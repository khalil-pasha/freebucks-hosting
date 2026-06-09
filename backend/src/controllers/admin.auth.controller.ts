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

      const isProd = process.env.NODE_ENV === 'production';
      res.cookie('admin_token', token, {
        httpOnly: true,
        secure: isProd || true, // sameSite 'none' requires secure: true
        sameSite: 'none',
        domain: isProd ? '.freebucks.host' : undefined,
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
  public static async changePassword(req: Request, res: Response) {
    try {
      const token = req.cookies?.admin_token;
      if (!token) return res.status(401).json({ error: 'Not authenticated' });
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Missing required fields' });

      const admin = await db.admin.findUnique({ where: { id: decoded.id } });
      if (!admin) return res.status(404).json({ error: 'Admin not found' });

      const isMatch = await bcrypt.compare(currentPassword, admin.password);
      if (!isMatch) return res.status(401).json({ error: 'Incorrect current password' });

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await db.admin.update({
        where: { id: admin.id },
        data: { password: hashedPassword }
      });

      return res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
      console.error('Change password error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  public static async forgotPassword(req: Request, res: Response) {
    try {
      const { username } = req.body;
      if (!username) return res.status(400).json({ error: 'Username is required' });

      const admin = await db.admin.findFirst({ where: { username } });
      if (!admin || !admin.email) {
        // Return generic success to prevent username enumeration
        return res.json({ success: true, message: 'If the user exists and has an email, an OTP has been sent.' });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await db.admin.update({
        where: { id: admin.id },
        data: { resetOtp: otp, resetOtpExpiry: expiry }
      });

      const { EmailService } = await import('../services/email.service');
      await EmailService.sendOTP(admin.email, otp);

      return res.json({ success: true, message: 'If the user exists and has an email, an OTP has been sent.' });
    } catch (error) {
      console.error('Forgot password error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  public static async verifyOtp(req: Request, res: Response) {
    try {
      const { username, otp } = req.body;
      if (!username || !otp) return res.status(400).json({ error: 'Username and OTP are required' });

      const admin = await db.admin.findFirst({ where: { username, resetOtp: otp } });
      if (!admin || !admin.resetOtpExpiry || admin.resetOtpExpiry < new Date()) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      const resetToken = jwt.sign({ id: admin.id, purpose: 'RESET_PASSWORD' }, JWT_SECRET, { expiresIn: '15m' });

      return res.json({ success: true, resetToken });
    } catch (error) {
      console.error('Verify OTP error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  public static async resetPassword(req: Request, res: Response) {
    try {
      const { resetToken, newPassword } = req.body;
      if (!resetToken || !newPassword) return res.status(400).json({ error: 'Missing required fields' });

      let decoded;
      try {
        decoded = jwt.verify(resetToken, JWT_SECRET) as any;
      } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired reset token' });
      }

      if (decoded.purpose !== 'RESET_PASSWORD') return res.status(403).json({ error: 'Invalid token purpose' });

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await db.admin.update({
        where: { id: decoded.id },
        data: { password: hashedPassword, resetOtp: null, resetOtpExpiry: null }
      });

      return res.json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
      console.error('Reset password error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

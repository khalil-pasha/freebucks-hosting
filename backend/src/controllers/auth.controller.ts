import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { db } from '../utils/db';
import crypto from 'crypto';
import { AuditService } from '../services/audit.service';

export class AuthController {
  public static login(req: Request, res: Response) {
    const state = crypto.randomBytes(16).toString('hex');
    
    // Store state in a cookie to support PM2 cluster mode seamlessly
    res.cookie('oauth_state', state, {
      maxAge: 5 * 60 * 1000, // 5 mins
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // lax allows it to be sent on top-level navigation from Discord
    });

    const authUrl = AuthService.getDiscordAuthUrl(state);
    res.redirect(authUrl);
  }

  public static async callback(req: Request, res: Response) {
    try {
      const { code, state } = req.query;
      const savedState = req.cookies?.oauth_state;

      if (!code || !state) {
        return res.status(400).send('Missing code or state');
      }

      if (!savedState || state !== savedState) {
        return res.status(400).send('Invalid state parameter');
      }

      // Clear the state cookie after successful verification
      res.clearCookie('oauth_state');

      // Exchange code
      const tokenData = await AuthService.exchangeCodeForToken(code as string);
      
      // Get Discord User
      const discordUser = await AuthService.getDiscordUser(tokenData.access_token);
      
      // Process Login/Register
      const user = await AuthService.processDiscordLogin(discordUser);
      
      // Generate JWT
      const token = AuthService.generateJwt(user);
      
      await AuditService.logAction(req, 'LOGIN', undefined, user.id);

      // Redirect to frontend with token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/dashboard?token=${token}`);
    } catch (error: any) {
      console.error('OAuth Callback Error:', error.response?.data || error.message);
      res.status(500).send('Authentication failed');
    }
  }

  public static async me(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const user = await db.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          discordId: true,
          username: true,
          avatar: true,
          email: true,
          role: true,
          balance: true,
          pterodactylUserId: true,
          createdAt: true
        }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  }

  public static logout(req: Request, res: Response) {
    // Since we use frontend tokens via URL params for now, logout is mostly a frontend action.
    // We just return success.
    res.json({ success: true, message: 'Logged out successfully' });
  }
}

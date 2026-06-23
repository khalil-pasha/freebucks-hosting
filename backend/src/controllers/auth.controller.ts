import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { db } from '../utils/db';
import crypto from 'crypto';
import { AuditService } from '../services/audit.service';

export class AuthController {
  public static login(req: Request, res: Response) {
    const state = crypto.randomBytes(16).toString('hex');
    
    const cookieOptions = {
      maxAge: 5 * 60 * 1000, // 5 mins
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' as const : 'lax' as const,
      domain: process.env.NODE_ENV === 'production' ? '.freebucks.host' : undefined
    };

    // Store state in a cookie to support PM2 cluster mode seamlessly
    res.cookie('oauth_state', state, cookieOptions);

    const redirectUrl = req.query.redirect;
    if (redirectUrl && typeof redirectUrl === 'string') {
      res.cookie('oauth_redirect', redirectUrl, cookieOptions);
    }

    const forcePrompt = req.query.forcePrompt === 'true';
    const authUrl = AuthService.getDiscordAuthUrl(state, forcePrompt);
    res.redirect(authUrl);
  }

  public static async callback(req: Request, res: Response) {
    try {
      const { code, state } = req.query;
      const savedState = req.cookies?.oauth_state;
      const savedRedirect = req.cookies?.oauth_redirect;

      if (!code || !state) {
        return res.status(400).send('Missing code or state');
      }

      if (!savedState || state !== savedState) {
        console.error(`[OAuth] State mismatch. Expected: ${savedState}, Received: ${state}`);
        return res.status(400).send('Invalid state parameter. Please ensure cookies are enabled and try logging in again.');
      }

      const cookieOptions = {
        maxAge: 5 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' as const : 'lax' as const,
        domain: process.env.NODE_ENV === 'production' ? '.freebucks.host' : undefined
      };

      // Clear the state cookie after successful verification
      res.clearCookie('oauth_state', cookieOptions);
      if (savedRedirect) {
        res.clearCookie('oauth_redirect', cookieOptions);
      }

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
      
      if (savedRedirect && savedRedirect.startsWith('/')) {
        const separator = savedRedirect.includes('?') ? '&' : '?';
        const finalUrl = `${frontendUrl}${savedRedirect}${separator}token=${token}`;
        res.redirect(finalUrl);
      } else {
        const finalUrl = `${frontendUrl}/dashboard?token=${token}`;
        res.redirect(finalUrl);
      }
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
          createdAt: true,
          premiumOrders: {
            where: { 
              status: 'COMPLETED',
              expiresAt: { gt: new Date() }
            },
            select: { id: true, expiresAt: true }
          }
        }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const { premiumOrders, ...userData } = user;
      const isPremium = premiumOrders.length > 0;
      const premiumExpiresAt = isPremium ? premiumOrders[0].expiresAt : null;

      res.json({ ...userData, isPremium, premiumExpiresAt });
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

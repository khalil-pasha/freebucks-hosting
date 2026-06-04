import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { db } from '../utils/db';
import crypto from 'crypto';

// Basic in-memory store for states (for development). 
// In prod, use Redis or signed cookies.
const stateStore = new Set<string>();

export class AuthController {
  public static login(req: Request, res: Response) {
    const state = crypto.randomBytes(16).toString('hex');
    stateStore.add(state);
    
    // Auto cleanup state after 5 mins
    setTimeout(() => stateStore.delete(state), 5 * 60 * 1000);

    const authUrl = AuthService.getDiscordAuthUrl(state);
    res.redirect(authUrl);
  }

  public static async callback(req: Request, res: Response) {
    try {
      const { code, state } = req.query;

      if (!code || !state) {
        return res.status(400).send('Missing code or state');
      }

      if (!stateStore.has(state as string)) {
        return res.status(400).send('Invalid state parameter');
      }

      stateStore.delete(state as string);

      // Exchange code
      const tokenData = await AuthService.exchangeCodeForToken(code as string);
      
      // Get Discord User
      const discordUser = await AuthService.getDiscordUser(tokenData.access_token);
      
      // Process Login/Register
      const user = await AuthService.processDiscordLogin(discordUser);
      
      // Generate JWT
      const token = AuthService.generateJwt(user);
      
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

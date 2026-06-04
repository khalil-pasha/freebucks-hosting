import axios from 'axios';
import jwt from 'jsonwebtoken';
import { db } from '../utils/db';

export class AuthService {
  public static getDiscordAuthUrl(state: string) {
    const clientId = process.env.DISCORD_CLIENT_ID!;
    const redirectUri = encodeURIComponent(process.env.DISCORD_REDIRECT_URI!);
    // Scopes needed: identify (username/avatar), email
    return `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify%20email&state=${state}`;
  }

  public static async exchangeCodeForToken(code: string) {
    const params = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID!,
      client_secret: process.env.DISCORD_CLIENT_SECRET!,
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.DISCORD_REDIRECT_URI!,
    });

    const response = await axios.post('https://discord.com/api/oauth2/token', params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data;
  }

  public static async getDiscordUser(accessToken: string) {
    const response = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  }

  public static async processDiscordLogin(discordUser: any) {
    const { id: discordId, username, global_name, avatar, email } = discordUser;

    const finalUsername = global_name || username;

    // Check if user exists
    let user = await db.user.findUnique({ where: { discordId } });

    if (user) {
      // Update info just in case they changed it
      user = await db.user.update({
        where: { id: user.id },
        data: {
          username: finalUsername,
          avatar,
          email,
        },
      });
    } else {
      // Create new user
      user = await db.user.create({
        data: {
          discordId,
          username: finalUsername,
          avatar,
          email,
          role: 'USER',
        },
      });
    }

    return user;
  }

  public static generateJwt(user: any) {
    const payload = {
      userId: user.id,
      discordId: user.discordId,
      role: user.role,
    };

    const secret = process.env.JWT_SECRET!;
    return jwt.sign(payload, secret, { expiresIn: '7d' });
  }
}

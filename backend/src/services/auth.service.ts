import axios from 'axios';
import jwt from 'jsonwebtoken';
import { db } from '../utils/db';

export class AuthService {
  public static getDiscordAuthUrl(state: string, forcePrompt: boolean = false) {
    const clientId = process.env.DISCORD_CLIENT_ID!;
    const redirectUri = encodeURIComponent(process.env.DISCORD_REDIRECT_URI!);
    // Scopes needed: identify (username/avatar), email
    let url = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify%20email&state=${state}`;
    if (forcePrompt) {
      url += '&prompt=consent';
    }
    return url;
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

  public static async processDiscordLogin(discordUser: any, referralCode?: string) {
    const { id: discordId, username, global_name, avatar, email } = discordUser;

    const finalUsername = global_name || username;
    const discordAvatarUrl = avatar ? `https://cdn.discordapp.com/avatars/${discordId}/${avatar}.png` : null;

    // Check if user exists
    let user = await db.user.findUnique({ where: { discordId } });

    if (user) {
      // Update info just in case they changed it
      // Only overwrite avatar if current is not custom
      const isCustomAvatar = user.avatar && user.avatar.includes('/uploads/avatars/');
      
      user = await db.user.update({
        where: { id: user.id },
        data: {
          username: finalUsername,
          ...(isCustomAvatar ? {} : { avatar: discordAvatarUrl }),
          ...(email ? { email } : {}), // only update if discord provides email, do not overwrite with null
        },
      });
    } else {
      // Create new user
      user = await db.user.create({
        data: {
          discordId,
          username: finalUsername,
          avatar: discordAvatarUrl,
          email,
          role: 'USER',
        },
      });

      // Handle referral for new users
      if (referralCode && referralCode !== user.id) {
        try {
          const referrer = await db.user.findUnique({ where: { id: referralCode } });
          if (referrer) {
            // Check if user was already referred
            const existingRef = await db.referral.findUnique({ where: { referredId: user.id } });
            if (!existingRef) {
              const referredReward = 50; // User gets 50 credits on signup

              await db.$transaction([
                db.referral.create({
                  data: {
                    referrerId: referrer.id,
                    referredId: user.id,
                    status: 'PENDING_INSTALL',
                    rewardAmount: 25, // Referrer gets 25 later
                    referredRewardedAt: new Date()
                  }
                }),
                db.user.update({
                  where: { id: user.id },
                  data: { balance: { increment: referredReward } }
                }),
                db.creditsTransaction.create({
                  data: {
                    userId: user.id,
                    amount: referredReward,
                    type: 'EARNED',
                    source: 'REFERRAL_BONUS'
                  }
                })
              ]);
            }
          }
        } catch (error) {
          console.error('[OAuth] Failed to process referral:', error);
        }
      }
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

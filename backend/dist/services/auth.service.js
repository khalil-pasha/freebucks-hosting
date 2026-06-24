"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const axios_1 = __importDefault(require("axios"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../utils/db");
class AuthService {
    static getDiscordAuthUrl(state, forcePrompt = false) {
        const clientId = process.env.DISCORD_CLIENT_ID;
        const redirectUri = encodeURIComponent(process.env.DISCORD_REDIRECT_URI);
        // Scopes needed: identify (username/avatar), email
        let url = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify%20email&state=${state}`;
        if (forcePrompt) {
            url += '&prompt=consent';
        }
        return url;
    }
    static async exchangeCodeForToken(code) {
        const params = new URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code,
            redirect_uri: process.env.DISCORD_REDIRECT_URI,
        });
        const response = await axios_1.default.post('https://discord.com/api/oauth2/token', params.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response.data;
    }
    static async getDiscordUser(accessToken) {
        const response = await axios_1.default.get('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    }
    static async processDiscordLogin(discordUser, referralCode) {
        const { id: discordId, username, global_name, avatar, email } = discordUser;
        const finalUsername = global_name || username;
        const discordAvatarUrl = avatar ? `https://cdn.discordapp.com/avatars/${discordId}/${avatar}.png` : null;
        // Check if user exists
        let user = await db_1.db.user.findUnique({ where: { discordId } });
        if (user) {
            // Update info just in case they changed it
            // Only overwrite avatar if current is not custom
            const isCustomAvatar = user.avatar && user.avatar.includes('/uploads/avatars/');
            user = await db_1.db.user.update({
                where: { id: user.id },
                data: {
                    username: finalUsername,
                    ...(isCustomAvatar ? {} : { avatar: discordAvatarUrl }),
                    ...(email ? { email } : {}), // only update if discord provides email, do not overwrite with null
                },
            });
        }
        else {
            // Create new user
            user = await db_1.db.user.create({
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
                    const referrer = await db_1.db.user.findUnique({ where: { id: referralCode } });
                    if (referrer) {
                        // Check if user was already referred
                        const existingRef = await db_1.db.referral.findUnique({ where: { referredId: user.id } });
                        if (!existingRef) {
                            const referredReward = 50; // User gets 50 credits on signup
                            await db_1.db.$transaction([
                                db_1.db.referral.create({
                                    data: {
                                        referrerId: referrer.id,
                                        referredId: user.id,
                                        status: 'PENDING_INSTALL',
                                        rewardAmount: 25, // Referrer gets 25 later
                                        referredRewardedAt: new Date()
                                    }
                                }),
                                db_1.db.user.update({
                                    where: { id: user.id },
                                    data: { balance: { increment: referredReward } }
                                }),
                                db_1.db.creditsTransaction.create({
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
                }
                catch (error) {
                    console.error('[OAuth] Failed to process referral:', error);
                }
            }
        }
        return user;
    }
    static generateJwt(user) {
        const payload = {
            userId: user.id,
            discordId: user.discordId,
            role: user.role,
        };
        const secret = process.env.JWT_SECRET;
        return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: '7d' });
    }
}
exports.AuthService = AuthService;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const db_1 = require("../utils/db");
const crypto_1 = __importDefault(require("crypto"));
// Basic in-memory store for states (for development). 
// In prod, use Redis or signed cookies.
const stateStore = new Set();
class AuthController {
    static login(req, res) {
        const state = crypto_1.default.randomBytes(16).toString('hex');
        stateStore.add(state);
        // Auto cleanup state after 5 mins
        setTimeout(() => stateStore.delete(state), 5 * 60 * 1000);
        const authUrl = auth_service_1.AuthService.getDiscordAuthUrl(state);
        res.redirect(authUrl);
    }
    static async callback(req, res) {
        try {
            const { code, state } = req.query;
            if (!code || !state) {
                return res.status(400).send('Missing code or state');
            }
            if (!stateStore.has(state)) {
                return res.status(400).send('Invalid state parameter');
            }
            stateStore.delete(state);
            // Exchange code
            const tokenData = await auth_service_1.AuthService.exchangeCodeForToken(code);
            // Get Discord User
            const discordUser = await auth_service_1.AuthService.getDiscordUser(tokenData.access_token);
            // Process Login/Register
            const user = await auth_service_1.AuthService.processDiscordLogin(discordUser);
            // Generate JWT
            const token = auth_service_1.AuthService.generateJwt(user);
            // Redirect to frontend with token
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            res.redirect(`${frontendUrl}/dashboard?token=${token}`);
        }
        catch (error) {
            console.error('OAuth Callback Error:', error.response?.data || error.message);
            res.status(500).send('Authentication failed');
        }
    }
    static async me(req, res) {
        try {
            const userId = req.user.id;
            const user = await db_1.db.user.findUnique({
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
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch user' });
        }
    }
    static logout(req, res) {
        // Since we use frontend tokens via URL params for now, logout is mostly a frontend action.
        // We just return success.
        res.json({ success: true, message: 'Logged out successfully' });
    }
}
exports.AuthController = AuthController;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../utils/db");
const requireAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    let token;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }
    else if (req.query.token && typeof req.query.token === 'string') {
        token = req.query.token;
    }
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: missing or invalid token' });
    }
    try {
        const secret = process.env.JWT_SECRET;
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        // Check session if sessionId exists in JWT (backward compatibility check)
        if (decoded.sessionId) {
            const session = await db_1.db.userSession.findUnique({
                where: { id: decoded.sessionId }
            });
            if (!session || session.isRevoked) {
                return res.status(401).json({ error: 'Unauthorized: session revoked or invalid' });
            }
            // Update last active if more than 5 minutes have passed
            const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
            if (session.lastActive < fiveMinsAgo) {
                // Non-blocking update
                db_1.db.userSession.update({
                    where: { id: session.id },
                    data: { lastActive: new Date() }
                }).catch(err => console.error('Failed to update lastActive:', err));
            }
        }
        else {
            // Force one fresh login for old JWTs
            return res.status(401).json({ error: 'Unauthorized: please login again' });
        }
        req.user = {
            id: decoded.userId,
            discordId: decoded.discordId,
            role: decoded.role,
            sessionId: decoded.sessionId,
        };
        next();
    }
    catch (err) {
        return res.status(401).json({ error: 'Unauthorized: token is invalid or expired' });
    }
};
exports.requireAuth = requireAuth;

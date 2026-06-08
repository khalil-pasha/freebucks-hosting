"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const db_1 = require("../utils/db");
const email_service_1 = require("../services/email.service");
const pterodactyl_service_1 = require("../services/pterodactyl.service");
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// In-memory OTP store
// Key: userId, Value: { otpHash: string, expiresAt: number, lastSentAt: number }
const otpStore = new Map();
class ProfileController {
    static async uploadAvatar(req, res) {
        try {
            const userId = req.user.id;
            const { imageBase64 } = req.body;
            if (!imageBase64) {
                return res.status(400).json({ error: 'Image data is required' });
            }
            // Basic validation for base64 image (data:image/png;base64,...)
            const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (!matches || matches.length !== 3) {
                return res.status(400).json({ error: 'Invalid image format' });
            }
            const mimeType = matches[1];
            const data = matches[2];
            const validMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
            if (!validMimeTypes.includes(mimeType)) {
                return res.status(400).json({ error: 'Unsupported file format. Use PNG, JPG, JPEG, or WEBP.' });
            }
            const buffer = Buffer.from(data, 'base64');
            if (buffer.length > 2 * 1024 * 1024) {
                return res.status(400).json({ error: 'File size exceeds 2MB limit.' });
            }
            const extension = mimeType.split('/')[1];
            const filename = `avatar_${userId}_${Date.now()}.${extension}`;
            const uploadDir = path_1.default.join(__dirname, '../../public/uploads/avatars');
            if (!fs_1.default.existsSync(uploadDir)) {
                fs_1.default.mkdirSync(uploadDir, { recursive: true });
            }
            const filePath = path_1.default.join(uploadDir, filename);
            fs_1.default.writeFileSync(filePath, buffer);
            // We'll serve this via static route: /uploads/avatars/filename
            const baseUrl = process.env.API_URL || `${req.protocol}://${req.get('host')}`;
            const avatarUrl = `${baseUrl}/uploads/avatars/${filename}`;
            await db_1.db.user.update({
                where: { id: userId },
                data: { avatar: avatarUrl }
            });
            res.json({ success: true, avatar: avatarUrl });
        }
        catch (error) {
            console.error('Avatar upload error:', error);
            res.status(500).json({ error: 'Failed to upload avatar.' });
        }
    }
    static async sendPasswordOtp(req, res) {
        try {
            const userId = req.user.id;
            const user = await db_1.db.user.findUnique({ where: { id: userId } });
            if (!user)
                return res.status(404).json({ error: 'User not found' });
            if (!user.pterodactylUserId) {
                return res.status(400).json({ error: 'No panel account found. Create a server first.' });
            }
            if (!user.email) {
                return res.status(400).json({ error: 'No email registered to this account.' });
            }
            const existingOtp = otpStore.get(userId);
            if (existingOtp && Date.now() - existingOtp.lastSentAt < 60000) {
                return res.status(429).json({ error: 'Please wait 60 seconds before requesting another OTP.' });
            }
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpHash = crypto_1.default.createHash('sha256').update(otp).digest('hex');
            const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
            otpStore.set(userId, { otpHash, expiresAt, lastSentAt: Date.now() });
            await email_service_1.EmailService.sendOTP(user.email, otp);
            res.json({ success: true, message: 'OTP sent to your email.' });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async resetPanelPassword(req, res) {
        try {
            const userId = req.user.id;
            const { otp, newPassword, confirmPassword } = req.body;
            if (!otp || !newPassword || !confirmPassword) {
                return res.status(400).json({ error: 'All fields are required' });
            }
            if (newPassword !== confirmPassword) {
                return res.status(400).json({ error: 'Passwords do not match' });
            }
            if (newPassword.length < 8) {
                return res.status(400).json({ error: 'Password must be at least 8 characters long' });
            }
            const user = await db_1.db.user.findUnique({ where: { id: userId } });
            if (!user || !user.pterodactylUserId) {
                return res.status(400).json({ error: 'No panel account found.' });
            }
            const storedOtp = otpStore.get(userId);
            if (!storedOtp) {
                return res.status(400).json({ error: 'Invalid or expired OTP.' });
            }
            if (Date.now() > storedOtp.expiresAt) {
                otpStore.delete(userId);
                return res.status(400).json({ error: 'OTP has expired.' });
            }
            const providedOtpHash = crypto_1.default.createHash('sha256').update(otp).digest('hex');
            if (providedOtpHash !== storedOtp.otpHash) {
                return res.status(400).json({ error: 'Invalid OTP.' });
            }
            // Update Pterodactyl User
            await pterodactyl_service_1.PterodactylService.updateUserPassword(user.pterodactylUserId, user.email, user.username, user.username, // first_name
            user.username, // last_name
            newPassword);
            otpStore.delete(userId);
            res.json({ success: true, message: 'Panel password updated successfully.' });
        }
        catch (error) {
            console.error('Password reset error:', error);
            res.status(400).json({ error: error.message || 'Failed to update panel password.' });
        }
    }
    static async updateEmail(req, res) {
        try {
            const userId = req.user.id;
            const { email } = req.body;
            if (!email || !email.includes('@')) {
                return res.status(400).json({ error: 'Valid email is required.' });
            }
            const existing = await db_1.db.user.findFirst({ where: { email, id: { not: userId } } });
            if (existing) {
                return res.status(400).json({ error: 'Email is already in use by another account.' });
            }
            await db_1.db.user.update({
                where: { id: userId },
                data: { email }
            });
            res.json({ success: true, message: 'Email updated successfully.' });
        }
        catch (error) {
            console.error('Update email error:', error);
            res.status(500).json({ error: 'Failed to update email.' });
        }
    }
}
exports.ProfileController = ProfileController;

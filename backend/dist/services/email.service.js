"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    static transporter = null;
    static getTransporter() {
        if (this.transporter)
            return this.transporter;
        if (!process.env.SMTP_HOST) {
            return null;
        }
        this.transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587', 10),
            secure: parseInt(process.env.SMTP_PORT || '587', 10) === 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        return this.transporter;
    }
    static async sendOTP(to, otp) {
        const transporter = this.getTransporter();
        if (!transporter) {
            throw new Error('Email service is not configured.');
        }
        const mailOptions = {
            from: process.env.SMTP_FROM || '"FreeBucks" <noreply@freebucks.host>',
            to,
            subject: 'Your Panel Password Reset OTP - FreeBucks',
            html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>You have requested to reset your FreeBucks game panel password.</p>
          <p>Your One-Time Password (OTP) is:</p>
          <h1 style="font-size: 36px; letter-spacing: 5px; color: #5865F2;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
          <br/>
          <p>Regards,<br/>The FreeBucks Team</p>
        </div>
      `
        };
        try {
            await transporter.sendMail(mailOptions);
            return true;
        }
        catch (error) {
            console.error('Failed to send OTP email:', error);
            throw new Error('Failed to send OTP email. Please try again later.');
        }
    }
}
exports.EmailService = EmailService;

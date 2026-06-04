"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const db_1 = require("../utils/db");
class NotificationService {
    static async createNotification(userId, title, message, type) {
        return await db_1.db.notification.create({
            data: {
                userId,
                title,
                message,
                type,
            },
        });
    }
    static async getUserNotifications(userId) {
        return await db_1.db.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }
    static async markAsRead(userId, notificationId) {
        const notification = await db_1.db.notification.findUnique({ where: { id: notificationId } });
        if (!notification || notification.userId !== userId) {
            throw new Error('Notification not found or unauthorized');
        }
        return await db_1.db.notification.update({
            where: { id: notificationId },
            data: { read: true },
        });
    }
    static async markAllAsRead(userId) {
        return await db_1.db.notification.updateMany({
            where: { userId, read: false },
            data: { read: true },
        });
    }
}
exports.NotificationService = NotificationService;

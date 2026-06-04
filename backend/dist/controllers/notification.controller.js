"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const notification_service_1 = require("../services/notification.service");
class NotificationController {
    static async getNotifications(req, res) {
        try {
            const userId = req.user.id;
            const notifications = await notification_service_1.NotificationService.getUserNotifications(userId);
            res.json(notifications);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async markAsRead(req, res) {
        try {
            const userId = req.user.id;
            const { notificationId } = req.body;
            if (!notificationId)
                return res.status(400).json({ error: 'notificationId is required' });
            const notification = await notification_service_1.NotificationService.markAsRead(userId, notificationId);
            res.json(notification);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async markAllAsRead(req, res) {
        try {
            const userId = req.user.id;
            const result = await notification_service_1.NotificationService.markAllAsRead(userId);
            res.json({ success: true, count: result.count });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.NotificationController = NotificationController;

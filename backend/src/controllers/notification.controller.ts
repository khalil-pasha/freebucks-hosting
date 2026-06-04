import { Request, Response } from 'express';
import { NotificationService } from '../services/notification.service';

export class NotificationController {
  public static async getNotifications(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const notifications = await NotificationService.getUserNotifications(userId);
      res.json(notifications);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async markAsRead(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { notificationId } = req.body;
      if (!notificationId) return res.status(400).json({ error: 'notificationId is required' });
      
      const notification = await NotificationService.markAsRead(userId, notificationId);
      res.json(notification);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  public static async markAllAsRead(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const result = await NotificationService.markAllAsRead(userId);
      res.json({ success: true, count: result.count });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

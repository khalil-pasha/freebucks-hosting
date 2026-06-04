import { db } from '../utils/db';

// This matches NotificationType enum in Prisma
export type NotificationTypeEnum = 
  'CREDIT_CLAIM' | 
  'VOUCHER' | 
  'REFERRAL' | 
  'SERVER_START' | 
  'SERVER_STOP' | 
  'SERVER_AUTO_STOP' | 
  'QUEUE_UPDATE' | 
  'ADMIN_ADJUSTMENT' | 
  'SYSTEM' |
  'TICKET_UPDATE';

export class NotificationService {
  public static async createNotification(userId: string, title: string, message: string, type: NotificationTypeEnum) {
    return await db.notification.create({
      data: {
        userId,
        title,
        message,
        type,
      },
    });
  }

  public static async getUserNotifications(userId: string) {
    return await db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  public static async markAsRead(userId: string, notificationId: string) {
    const notification = await db.notification.findUnique({ where: { id: notificationId } });
    if (!notification || notification.userId !== userId) {
      throw new Error('Notification not found or unauthorized');
    }

    return await db.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  }

  public static async markAllAsRead(userId: string) {
    return await db.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }
}

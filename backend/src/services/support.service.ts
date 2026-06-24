import { db } from '../utils/db';
import { NotificationService } from './notification.service';
import { TicketStatus } from '@prisma/client';

export class SupportService {
  // USER ACTIONS
  public static async createTicket(userId: string, subject: string, message: string) {
    return await db.$transaction(async (tx: any) => {
      const ticket = await tx.supportTicket.create({
        data: {
          userId,
          subject,
          status: 'PENDING',
        },
      });

      await tx.ticketMessage.create({
        data: {
          ticketId: ticket.id,
          userId,
          message,
          isStaffReply: false,
        },
      });

      // Notify admins - in a real app we might have a specific notification for admins
      // But for now, we notify the system or we can skip until we have a proper admin dashboard.
      // The user requested: "Notify admins when user creates a ticket."
      // Since notifications are user-based, we'll find all admins.
      const admins = await tx.user.findMany({ where: { role: 'ADMIN' } });
      for (const admin of admins) {
        await NotificationService.createNotification(
          admin.id,
          'New Support Ticket',
          `A new ticket has been opened: ${subject}`,
          'TICKET_UPDATE'
        );
      }

      return ticket;
    });
  }

  public static async getUserTickets(userId: string) {
    return await db.supportTicket.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: { select: { messages: true } },
      },
    });
  }

  public static async getTicketById(userId: string, ticketId: string) {
    const ticket = await db.supportTicket.findUnique({
      where: { id: ticketId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          include: { user: { select: { username: true, avatar: true, role: true } } },
        },
      },
    });

    if (!ticket || ticket.userId !== userId) {
      throw new Error('Ticket not found or unauthorized');
    }

    return ticket;
  }

  public static async replyToTicket(userId: string, ticketId: string, message: string) {
    const ticket = await db.supportTicket.findUnique({ where: { id: ticketId } });
    if (!ticket || ticket.userId !== userId) {
      throw new Error('Ticket not found or unauthorized');
    }

    if (ticket.status === 'CLOSED') {
      throw new Error('Cannot reply to a closed ticket.');
    }

    return await db.$transaction(async (tx: any) => {
      const msg = await tx.ticketMessage.create({
        data: {
          ticketId,
          userId,
          message,
          isStaffReply: false,
        },
      });

      await tx.supportTicket.update({
        where: { id: ticketId },
        data: { status: 'PENDING', updatedAt: new Date() }, // Set back to PENDING if they reply
      });

      return msg;
    });
  }

  // ADMIN ACTIONS
  public static async getAllTickets() {
    return await db.supportTicket.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        user: { select: { username: true, email: true } },
        _count: { select: { messages: true } },
      },
    });
  }

  public static async getAdminTicketById(ticketId: string) {
    const ticket = await db.supportTicket.findUnique({
      where: { id: ticketId },
      include: {
        user: { select: { username: true, email: true } },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: { user: { select: { username: true, avatar: true, role: true } } },
        },
      },
    });

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    return ticket;
  }

  public static async adminReplyToTicket(adminId: string, ticketId: string, message: string) {
    const ticket = await db.supportTicket.findUnique({ where: { id: ticketId } });
    if (!ticket) throw new Error('Ticket not found');

    if (ticket.status === 'CLOSED') {
      throw new Error('Cannot reply to a closed ticket.');
    }

    return await db.$transaction(async (tx: any) => {
      const msg = await tx.ticketMessage.create({
        data: {
          ticketId,
          userId: adminId,
          message,
          isStaffReply: true,
        },
      });

      await tx.supportTicket.update({
        where: { id: ticketId },
        data: { status: 'OPEN', updatedAt: new Date() }, // OPEN means waiting on user
      });

      await NotificationService.createNotification(
        ticket.userId,
        'Support Ticket Updated',
        `A staff member has replied to your ticket: ${ticket.subject}`,
        'TICKET_UPDATE'
      );

      return msg;
    });
  }

  public static async updateTicketStatus(ticketId: string, status: TicketStatus) {
    const ticket = await db.supportTicket.findUnique({ where: { id: ticketId } });
    if (!ticket) throw new Error('Ticket not found');

    const updated = await db.supportTicket.update({
      where: { id: ticketId },
      data: { status, updatedAt: new Date() },
    });

    await NotificationService.createNotification(
      ticket.userId,
      `Support Ticket ${status === 'CLOSED' ? 'Closed' : 'Reopened'}`,
      `Your ticket '${ticket.subject}' has been marked as ${status}.`,
      'TICKET_UPDATE'
    );

    return updated;
  }
}

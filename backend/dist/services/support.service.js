"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportService = void 0;
const db_1 = require("../utils/db");
const notification_service_1 = require("./notification.service");
class SupportService {
    // USER ACTIONS
    static async createTicket(userId, subject, message) {
        return await db_1.db.$transaction(async (tx) => {
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
                await notification_service_1.NotificationService.createNotification(admin.id, 'New Support Ticket', `A new ticket has been opened: ${subject}`, 'TICKET_UPDATE');
            }
            return ticket;
        });
    }
    static async getUserTickets(userId) {
        return await db_1.db.supportTicket.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
            include: {
                _count: { select: { messages: true } },
            },
        });
    }
    static async getTicketById(userId, ticketId) {
        const ticket = await db_1.db.supportTicket.findUnique({
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
    static async replyToTicket(userId, ticketId, message) {
        const ticket = await db_1.db.supportTicket.findUnique({ where: { id: ticketId } });
        if (!ticket || ticket.userId !== userId) {
            throw new Error('Ticket not found or unauthorized');
        }
        if (ticket.status === 'CLOSED') {
            throw new Error('Cannot reply to a closed ticket.');
        }
        return await db_1.db.$transaction(async (tx) => {
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
    static async getAllTickets() {
        return await db_1.db.supportTicket.findMany({
            orderBy: { updatedAt: 'desc' },
            include: {
                user: { select: { username: true, email: true } },
                _count: { select: { messages: true } },
            },
        });
    }
    static async getAdminTicketById(ticketId) {
        const ticket = await db_1.db.supportTicket.findUnique({
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
    static async adminReplyToTicket(adminId, ticketId, message) {
        const ticket = await db_1.db.supportTicket.findUnique({ where: { id: ticketId } });
        if (!ticket)
            throw new Error('Ticket not found');
        if (ticket.status === 'CLOSED') {
            throw new Error('Cannot reply to a closed ticket.');
        }
        return await db_1.db.$transaction(async (tx) => {
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
            await notification_service_1.NotificationService.createNotification(ticket.userId, 'Support Ticket Updated', `A staff member has replied to your ticket: ${ticket.subject}`, 'TICKET_UPDATE');
            return msg;
        });
    }
    static async updateTicketStatus(ticketId, status) {
        const ticket = await db_1.db.supportTicket.findUnique({ where: { id: ticketId } });
        if (!ticket)
            throw new Error('Ticket not found');
        const updated = await db_1.db.supportTicket.update({
            where: { id: ticketId },
            data: { status, updatedAt: new Date() },
        });
        await notification_service_1.NotificationService.createNotification(ticket.userId, `Support Ticket ${status === 'CLOSED' ? 'Closed' : 'Reopened'}`, `Your ticket '${ticket.subject}' has been marked as ${status}.`, 'TICKET_UPDATE');
        return updated;
    }
}
exports.SupportService = SupportService;

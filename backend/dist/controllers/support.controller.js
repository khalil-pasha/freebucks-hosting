"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportController = void 0;
const support_service_1 = require("../services/support.service");
class SupportController {
    static async createTicket(req, res) {
        try {
            const userId = req.user.id;
            const { subject, message } = req.body;
            if (!subject || !message) {
                return res.status(400).json({ error: 'Subject and message are required' });
            }
            const ticket = await support_service_1.SupportService.createTicket(userId, subject, message);
            res.status(201).json(ticket);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async getMyTickets(req, res) {
        try {
            const userId = req.user.id;
            const tickets = await support_service_1.SupportService.getUserTickets(userId);
            res.json(tickets);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getTicketById(req, res) {
        try {
            const userId = req.user.id;
            const ticketId = req.params.id;
            const ticket = await support_service_1.SupportService.getTicketById(userId, ticketId);
            console.log("[SupportAPI] returning messages count", ticket.messages.length);
            res.json(ticket);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
    static async reply(req, res) {
        try {
            const userId = req.user.id;
            const ticketId = req.params.id;
            const { message } = req.body;
            if (!message) {
                return res.status(400).json({ error: 'Message is required' });
            }
            const reply = await support_service_1.SupportService.replyToTicket(userId, ticketId, message);
            res.status(201).json(reply);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.SupportController = SupportController;

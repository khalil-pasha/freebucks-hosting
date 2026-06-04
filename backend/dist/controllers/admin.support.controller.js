"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSupportController = void 0;
const support_service_1 = require("../services/support.service");
class AdminSupportController {
    static async getAllTickets(req, res) {
        try {
            const tickets = await support_service_1.SupportService.getAllTickets();
            res.json(tickets);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getTicketById(req, res) {
        try {
            const ticketId = req.params.id;
            const ticket = await support_service_1.SupportService.getAdminTicketById(ticketId);
            res.json(ticket);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
    static async reply(req, res) {
        try {
            const adminId = req.user.id;
            const ticketId = req.params.id;
            const { message } = req.body;
            if (!message) {
                return res.status(400).json({ error: 'Message is required' });
            }
            const reply = await support_service_1.SupportService.adminReplyToTicket(adminId, ticketId, message);
            res.status(201).json(reply);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async closeTicket(req, res) {
        try {
            const ticketId = req.params.id;
            const ticket = await support_service_1.SupportService.updateTicketStatus(ticketId, 'CLOSED');
            res.json(ticket);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async reopenTicket(req, res) {
        try {
            const ticketId = req.params.id;
            const ticket = await support_service_1.SupportService.updateTicketStatus(ticketId, 'OPEN');
            res.json(ticket);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.AdminSupportController = AdminSupportController;

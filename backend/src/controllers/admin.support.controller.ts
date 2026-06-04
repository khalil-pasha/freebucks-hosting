import { Request, Response } from 'express';
import { SupportService } from '../services/support.service';

export class AdminSupportController {
  public static async getAllTickets(req: Request, res: Response) {
    try {
      const tickets = await SupportService.getAllTickets();
      res.json(tickets);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async getTicketById(req: Request, res: Response) {
    try {
      const ticketId = req.params.id as string;
      const ticket = await SupportService.getAdminTicketById(ticketId);
      res.json(ticket);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  public static async reply(req: Request, res: Response) {
    try {
      const adminId = req.user!.id;
      const ticketId = req.params.id as string;
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const reply = await SupportService.adminReplyToTicket(adminId, ticketId, message);
      res.status(201).json(reply);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  public static async closeTicket(req: Request, res: Response) {
    try {
      const ticketId = req.params.id as string;
      const ticket = await SupportService.updateTicketStatus(ticketId, 'CLOSED');
      res.json(ticket);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  public static async reopenTicket(req: Request, res: Response) {
    try {
      const ticketId = req.params.id as string;
      const ticket = await SupportService.updateTicketStatus(ticketId, 'OPEN');
      res.json(ticket);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

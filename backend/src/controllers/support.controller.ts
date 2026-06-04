import { Request, Response } from 'express';
import { SupportService } from '../services/support.service';

export class SupportController {
  public static async createTicket(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { subject, message } = req.body;
      if (!subject || !message) {
        return res.status(400).json({ error: 'Subject and message are required' });
      }

      const ticket = await SupportService.createTicket(userId, subject, message);
      res.status(201).json(ticket);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  public static async getMyTickets(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const tickets = await SupportService.getUserTickets(userId);
      res.json(tickets);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async getTicketById(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const ticketId = req.params.id as string;
      const ticket = await SupportService.getTicketById(userId, ticketId);
      res.json(ticket);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  public static async reply(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const ticketId = req.params.id as string;
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const reply = await SupportService.replyToTicket(userId, ticketId, message);
      res.status(201).json(reply);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

import { z } from 'zod';

export const createTicketSchema = z.object({
  subject: z.string().min(3).max(100),
  message: z.string().min(10).max(5000)
});

export const replyTicketSchema = z.object({
  message: z.string().min(2).max(5000)
});

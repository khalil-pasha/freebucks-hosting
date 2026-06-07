import { z } from 'zod';

export const createServerSchema = z.object({
  name: z.string().min(3).max(50),
  ramGB: z.number().positive().max(32),
  cpu: z.number().positive().max(800),
  disk: z.number().positive().max(100),
  pterodactyl: z.object({
    email: z.string().email(),
    username: z.string().min(3).max(50),
    firstName: z.string().min(1).max(50),
    lastName: z.string().min(1).max(50),
    password: z.string().min(8)
  }).optional()
});

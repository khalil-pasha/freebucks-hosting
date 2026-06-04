import { z } from 'zod';

export const createServerSchema = z.object({
  name: z.string().min(3).max(50),
  ramGB: z.number().int().positive().max(32)
});

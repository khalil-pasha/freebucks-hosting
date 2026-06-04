import { z } from 'zod';

export const adminServerActionSchema = z.object({
  serverId: z.string().uuid()
});

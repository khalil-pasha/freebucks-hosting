import { z } from 'zod';

export const redeemVoucherSchema = z.object({
  code: z.string().min(3).max(50)
});

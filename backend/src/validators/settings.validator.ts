import { z } from 'zod';

export const updateSettingSchema = z.object({
  key: z.string().min(1).max(100),
  value: z.union([z.string(), z.number(), z.boolean()]).transform(val => String(val))
});

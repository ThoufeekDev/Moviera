import { z } from 'zod';

export const createScreenSchema = z.object({
  theatreId: z.string().trim().min(1, 'Theatre ID is required'),
  name: z
    .string()
    .trim()
    .min(1, 'Screen name is required')
    .max(100, 'Screen name must not exceed 100 character'),
});

export type CreateScreenInput = z.infer<typeof createScreenSchema>;

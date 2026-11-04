import { z } from 'zod';

export const listScreensQuerySchema = z.object({
  search: z.string().trim().optional(),

  status: z
    .enum(['ALL', 'ACTIVE', 'INACTIVE'])
    .default('ALL'),

  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type ListScreensQueryInput = z.infer<typeof listScreensQuerySchema>;

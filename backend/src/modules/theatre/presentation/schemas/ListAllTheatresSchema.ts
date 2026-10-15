import { z } from 'zod';

export const listAllTheatresQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: z.enum(['ALL', 'ACTIVE', 'INACTIVE']).optional().default('ALL'),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  page: z.coerce.number().int().min(1).optional().default(1),
});

export type ListAllTheatresQueryInput = z.infer<typeof listAllTheatresQuerySchema>;

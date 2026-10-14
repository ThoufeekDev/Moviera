import { z } from 'zod';

export const listTheatresForAdminQuerySchema = z.object({
  search: z.string().trim().optional(),
  city: z.string().trim().optional(),
  status: z.enum(['ALL', 'ASSIGNED', 'UNASSIGNED']).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
  page: z.coerce.number().int().min(1).optional().default(1),
});

export type ListTheatresForAdminQueryInput = z.infer<
  typeof listTheatresForAdminQuerySchema
>;

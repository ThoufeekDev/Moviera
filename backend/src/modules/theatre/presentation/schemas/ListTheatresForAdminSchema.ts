import { z } from 'zod';

export const listTheatresForAdminQuerySchema = z.object({
  search: z.string().trim().optional(),
  city: z.string().trim().optional(),
  status: z.enum(['ALL', 'ASSIGNED', 'UNASSIGNED']).optional(),
});

export type ListTheatresForAdminQueryInput = z.infer<
  typeof listTheatresForAdminQuerySchema
>;

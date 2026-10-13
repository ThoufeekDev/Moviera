import { z } from 'zod';

export const listTheatreAdminAssignmentsQuerySchema = z.object({
  theatreId: z.string().trim().optional(),
  search: z.string().trim().optional(),
  role: z.enum(['PRIMARY_MANAGER', 'OPERATIONS_SUPERVISOR', 'BOX_OFFICE_LEAD']).optional(),
  status: z.enum(['ALL', 'ACTIVE', 'SUSPENDED']).optional(),
});

export type ListTheatreAdminAssignmentsQueryInput = z.infer<
  typeof listTheatreAdminAssignmentsQuerySchema
>;

import { z } from 'zod';

export const listEligibleAdminsQuerySchema = z.object({
  search: z.string().trim().optional(),
});

export type ListEligibleAdminsQueryInput = z.infer<
  typeof listEligibleAdminsQuerySchema
>;

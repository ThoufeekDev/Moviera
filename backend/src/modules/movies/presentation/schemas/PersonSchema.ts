import { z } from 'zod';

export const createPersonSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
});

export const getPersonByIdParamSchema = z.object({
  id: z.string().trim().min(1, 'ID is required'),
});

export type CreatePersonInput = z.infer<typeof createPersonSchema>;
export type GetPersonByIdParamInput = z.infer<typeof getPersonByIdParamSchema>;

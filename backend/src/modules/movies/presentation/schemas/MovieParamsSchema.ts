import { z } from 'zod';

export const getMovieBySlugParamSchema = z.object({
  slug: z.string().trim().min(1, 'Slug is required'),
});

export const getMovieByIdParamSchema = z.object({
  id: z.string().trim().min(1, 'ID is required'),
});

export type GetMovieBySlugParamInput = z.infer<typeof getMovieBySlugParamSchema>;
export type GetMovieByIdParamInput = z.infer<typeof getMovieByIdParamSchema>;

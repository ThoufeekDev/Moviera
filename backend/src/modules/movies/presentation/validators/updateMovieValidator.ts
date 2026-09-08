import { z } from 'zod';

export const updateMovieSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  duration: z.number().positive().optional(),
  releaseDate: z.coerce.date().optional(),
  language: z.string().min(1).optional(),
  genre: z.string().min(1).optional(),
  certificate: z.string().min(1).optional(),
  posterUrl: z.string().url().optional(),
  backdropUrl: z.string().url().optional(),
  trailerUrl: z.string().url().optional(),
  isActive: z.boolean().optional(),
});

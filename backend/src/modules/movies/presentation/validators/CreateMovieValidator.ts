import { z } from "zod";

export const createMovieSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  duration: z.number().positive(),
  releaseDate: z.coerce.date(),
  language: z.string().min(1),
  genre: z.string().min(1),
  certificate: z.string().min(1),
  posterUrl: z.url().optional(),
  backdropUrl: z.url().optional(),
  trailerUrl: z.url().optional(),
});
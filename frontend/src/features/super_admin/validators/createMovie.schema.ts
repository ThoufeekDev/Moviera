import { z } from 'zod';

export const createMovieSchema = z.object({
  title: z.string().min(1, 'Movie title is required').max(150, 'Movie title is too long'),

  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description is too long'),

  duration: z
    .number({
      error: 'Duration is required',
    })
    .positive('Duration must be greater than 0'),

  releaseDate: z.coerce.date({
    error: 'Release date is required',
  }),

  language: z.string().min(1, 'Language is required'),

  genre: z.string().min(1, 'Genre is required'),

  certificate: z.string().min(1, 'Certificate is required'),

  trailerUrl: z.string().url('Please enter a valid trailer URL').optional(),
});

export type CreateMovieFormInput = z.input<typeof createMovieSchema>;

export type CreateMovieFormData = z.output<typeof createMovieSchema>;

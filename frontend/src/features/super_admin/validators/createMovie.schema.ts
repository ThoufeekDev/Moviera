import { z } from 'zod';

const imageFileSchema = z
  .instanceof(File, {
    message: 'Image is required',
  })
  .refine(
    (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
    'Only JPG, PNG or WEBP images are allowed',
  )
  .refine((file) => file.size <= 5 * 1024 * 1024, 'Image must be less than 5MB');

export const createMovieSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Movie title is required')
    .max(150, 'Movie title is too long'),

  description: z
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description is too long'),

  duration: z.preprocess(
    (val) => (val === '' || val === null || (typeof val === 'number' && Number.isNaN(val)) ? undefined : Number(val)),
    z
      .number({
        message: 'Duration is required',
      })
      .positive('Duration must be greater than 0')
      .int('Duration must be a whole number'),
  ),

  releaseDate: z
    .string()
    .min(1, 'Release date is required')
    .refine(
      (value) => !Number.isNaN(new Date(value).getTime()),
      'Invalid release date',
    ),

  genre: z.string().trim().min(1, 'Genre is required'),

  certificate: z.string().trim().min(1, 'Certificate is required'),

  languages: z.array(z.string().min(1)).min(1, 'Select at least one language'),

  poster: imageFileSchema,

  backdrop: imageFileSchema,

  trailerUrl: z
    .string()
    .trim()
    .url('Please enter a valid trailer URL')
    .optional()
    .or(z.literal('')),

  cast: z
    .array(
      z.object({
        personId: z.string().min(1, 'Person ID is required'),
        character: z.string().optional(),
      }),
    )
    .min(1, 'Add at least one cast member'),

  crew: z
    .array(
      z.object({
        personId: z.string().min(1, 'Person ID is required'),
        job: z.string().min(1, 'Crew job is required'),
      }),
    )
    .min(1, 'Add at least one crew member'),
});

export type CreateMovieFormInput = z.input<typeof createMovieSchema>;

export type CreateMovieFormData = z.output<typeof createMovieSchema>;

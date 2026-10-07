import { z } from 'zod';
import { Certification } from '../../domain/enums/Certification';

const jsonArray = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess(
    (value) => {
      if (typeof value !== 'string') {
        return value;
      }

      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    },
    schema,
  );

const uniqueIds = (message: string) =>
  z
    .array(z.string().min(1))
    .refine(
      (ids) => new Set(ids).size === ids.length,
      message,
    );

export const createMovieSchema = z.object({
  title: z.string().min(1),

  description: z.string().optional(),

  duration: z.coerce.number().positive(),

  releaseDate: z.coerce.date(),

  languages: jsonArray(
    z.array(z.string().min(1)).min(1),
  ),

  cast: jsonArray(
    z.array(
      z.object({
        personId: z.string().min(1),
        character: z.string().optional(),
      }),
    ),
  ),

  crew: jsonArray(
    z.array(
      z.object({
        personId: z.string().min(1),
        job: z.string().min(1),
      }),
    ),
  ),

  primaryGenreId: z.string().min(1, 'Primary genre is required'),

  genreIds: jsonArray(
    uniqueIds('Duplicate genre IDs are not allowed').refine(
      (ids) => ids.length > 0,
      'At least one genre is required',
    ),
  ),

  certification: z.enum(Certification),

  cinemaFormatIds: jsonArray(
    uniqueIds('Duplicate cinema format IDs are not allowed').refine(
      (ids) => ids.length > 0,
      'At least one cinema format is required',
    ),
  ),

  trailerUrl: z.url().optional(),
});
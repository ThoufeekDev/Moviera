
import { z } from 'zod';
import { Certification } from '../../domain/enums/Certification';

/**
 * Safely parse JSON values coming from multipart/form-data.
 *
 * If the value is valid JSON, it is parsed.
 * If parsing fails, the original value is returned so Zod
 * can report it as invalid input instead of throwing a
 * raw JSON.parse SyntaxError.
 */
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

/**
 * Validates that an array does not contain duplicate IDs.
 */
const uniqueIds = (message: string) =>
  z
    .array(z.string().min(1))
    .refine(
      (ids) => new Set(ids).size === ids.length,
      message,
    );

export const updateMovieSchema = z.object({
  title: z.string().min(1).optional(),

  description: z.string().optional(),

  duration: z.coerce.number().positive().optional(),

  releaseDate: z.coerce.date().optional(),

  primaryGenreId: z.string().min(1).optional(),

  genreIds: jsonArray(
    uniqueIds('Duplicate genre IDs are not allowed'),
  ).optional(),

  certification: z.enum(Certification).optional(),

  languageIds: jsonArray(
    uniqueIds('Duplicate language IDs are not allowed'),
  ).optional(),

  cinemaFormatIds: jsonArray(
    uniqueIds('Duplicate cinema format IDs are not allowed'),
  ).optional(),

  cast: jsonArray(
    z.array(
      z.object({
        personId: z.string().min(1),
        character: z.string().optional(),
      }),
    ),
  ).optional(),

  crew: jsonArray(
    z.array(
      z.object({
        personId: z.string().min(1),
        job: z.string().min(1),
      }),
    ),
  ).optional(),

  trailerUrl: z.url().optional(),

  isActive: z.coerce.boolean().optional(),
});

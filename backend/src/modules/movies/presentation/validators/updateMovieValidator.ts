import { z } from "zod";
import { Certification } from "../../../../shared/enums/Certification";

export const updateMovieSchema = z.object({
  title: z.string().min(1).optional(),

  description: z.string().optional(),

  duration: z.coerce.number().positive().optional(),

  releaseDate: z.coerce.date().optional(),

  primaryGenreId: z.string().min(1).optional(),

  certification: z.enum(Certification).optional(),

  languageIds: z
    .string()
    .transform((value) => JSON.parse(value))
    .pipe(z.array(z.string().min(1)))
    .optional(),

  cinemaFormatIds: z
    .string()
    .transform((value) => JSON.parse(value))
    .pipe(z.array(z.string().min(1)))
    .optional(),

  cast: z
    .string()
    .transform((value) => JSON.parse(value))
    .pipe(
      z.array(
        z.object({
          personId: z.string().min(1),
          character: z.string().optional(),
        }),
      ),
    )
    .optional(),

  crew: z
    .string()
    .transform((value) => JSON.parse(value))
    .pipe(
      z.array(
        z.object({
          personId: z.string().min(1),
          job: z.string().min(1),
        }),
      ),
    )
    .optional(),

  trailerUrl: z.url().optional(),

  isActive: z.coerce.boolean().optional(),
});
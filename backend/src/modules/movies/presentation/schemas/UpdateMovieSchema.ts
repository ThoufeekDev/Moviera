import { z } from 'zod';
import { Certification } from '../../domain/enums/Certification';
import { jsonArray, uniqueIds } from './shared/arrayUtils';
import { aliasLanguages } from './shared/aliasLanguages';

export const updateMovieSchema = z.preprocess(
  aliasLanguages,
  z.object({
    title: z.string().trim().min(1).optional(),

    description: z.string().nullable().optional(),

    duration: z.coerce.number().int().positive().optional(),

    releaseDate: z.coerce.date().optional(),

    primaryGenreId: z.string().trim().min(1).optional(),

    genreIds: jsonArray(
      uniqueIds('Duplicate genre IDs are not allowed').refine(
        (ids) => ids.length > 0,
        'At least one genre is required',
      ),
    ).optional(),

    certification: z.enum(Certification).optional(),

    languageIds: jsonArray(
      uniqueIds('Duplicate language IDs are not allowed').refine(
        (ids) => ids.length > 0,
        'At least one language is required',
      ),
    ).optional(),

    theatreFormatIds: jsonArray(
      uniqueIds('Duplicate theatre format IDs are not allowed').refine(
        (ids) => ids.length > 0,
        'At least one theatre format is required',
      ),
    ).optional(),

    cast: jsonArray(
      z
        .array(
          z.object({
            personId: z.string().trim().min(1),
            character: z.string().nullable().optional(),
          }),
        )
        .refine(
          (members) => {
            const keys = new Set(
              members.map(
                (m) => `${m.personId.trim()}:${(m.character?.trim() ?? '').toLowerCase()}`,
              ),
            );
            return keys.size === members.length;
          },
          'Duplicate cast entries (same person and character) are not allowed',
        ),
    ).optional(),

    crew: jsonArray(
      z
        .array(
          z.object({
            personId: z.string().trim().min(1),
            job: z.string().trim().min(1),
          }),
        )
        .refine(
          (members) => {
            const keys = new Set(
              members.map(
                (m) => `${m.personId.trim()}:${m.job.trim().toLowerCase()}`,
              ),
            );
            return keys.size === members.length;
          },
          'Duplicate crew entries (same person and job) are not allowed',
        ),
    ).optional(),

    trailerUrl: z
      .url()
      .or(z.literal(''))
      .nullable()
      .optional()
      .transform((val) => (val === '' ? null : val)),

    isActive: z
      .union([
        z.boolean(),
        z.enum(['true', 'false']).transform((value) => value === 'true'),
      ])
      .optional(),
  }),
);

export type UpdateMovieInput = z.infer<typeof updateMovieSchema>;

import { z } from 'zod';
import { Certification } from '../../domain/enums/Certification';
import { jsonArray, uniqueIds } from './shared/arrayUtils';

export const updateMovieSchema = z.preprocess(
  (val: any) => {
    if (val && typeof val === 'object') {
      if (val.languages && !val.languageIds) {
        val.languageIds = val.languages;
      }
    }
    return val;
  },
  z.object({
    title: z.string().trim().min(1).optional(),

    description: z.string().nullable().optional(),

    duration: z.coerce.number().positive().optional(),

    releaseDate: z.coerce.date().optional(),

    primaryGenreId: z.string().trim().min(1).optional(),

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
      z.array(
        z.object({
          personId: z.string().trim().min(1),
          job: z.string().trim().min(1),
        }),
      ),
    ).optional(),

    trailerUrl: z
      .url()
      .or(z.literal(''))
      .nullable()
      .optional()
      .transform((val) => (val === '' ? null : val)),

    isActive: z
      .enum(['true', 'false'])
      .transform((value) => value === 'true')
      .optional(),
  }),
);

export type UpdateMovieInput = z.infer<typeof updateMovieSchema>;

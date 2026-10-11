import { z } from 'zod';
import { Certification } from '../../domain/enums/Certification';
import { jsonArray, uniqueIds } from './shared/arrayUtils';

export const createMovieSchema = z.preprocess(
  (val: any) => {
    if (val && typeof val === 'object') {
      if (val.languages && !val.languageIds) {
        val.languageIds = val.languages;
      }
    }
    return val;
  },
  z.object({
    title: z.string().trim().min(1, 'Title is required'),

    description: z.string().optional(),

    duration: z.coerce.number().positive('Duration must be positive'),

    releaseDate: z.coerce.date(),

    languageIds: jsonArray(
      uniqueIds('Duplicate language IDs are not allowed').refine(
        (ids) => ids.length > 0,
        'At least one language is required',
      ),
    ),

    cast: jsonArray(
      z
        .array(
          z.object({
            personId: z.string().trim().min(1, 'Person ID is required'),
            character: z.string().optional(),
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
    ),

    crew: jsonArray(
      z.array(
        z.object({
          personId: z.string().trim().min(1, 'Person ID is required'),
          job: z.string().trim().min(1, 'Job is required'),
        }),
      ),
    ),

    primaryGenreId: z.string().trim().min(1, 'Primary genre is required'),

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

    trailerUrl: z
      .url()
      .or(z.literal(''))
      .optional()
      .transform((val) => (val === '' ? undefined : val)),
  }),
);

export type CreateMovieInput = z.infer<typeof createMovieSchema>;

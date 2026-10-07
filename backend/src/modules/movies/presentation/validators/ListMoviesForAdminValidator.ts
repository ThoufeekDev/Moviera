import { z } from 'zod';
import { Certification } from '../../domain/enums/Certification';
import { MovieSortBy } from '../../application/queries/MovieSortBy';
import { MovieStatus } from '../../application/queries/MovieStatus';

export const ListMoviesForAdminValidator = z
  .object({
    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(50).default(12),

    search: z.string().trim().optional(),

    status: z.nativeEnum(MovieStatus).optional(),

    genreId: z.string().trim().min(1).optional(),

    languageId: z.string().trim().min(1).optional(),

    certification: z.nativeEnum(Certification).optional(),

    releaseStatus: z.enum(['NOW_SHOWING', 'UPCOMING']).optional(),

    releaseDateFrom: z.coerce.date().optional(),

    releaseDateTo: z.coerce
      .date()
      .transform((date) => {
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        return endOfDay;
      })
      .optional(),

    sortBy: z
      .enum(Object.values(MovieSortBy) as [MovieSortBy, ...MovieSortBy[]])
      .default(MovieSortBy.CREATED_AT),

    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  })
  .refine(
    (data) =>
      !data.releaseDateFrom || !data.releaseDateTo || data.releaseDateFrom <= data.releaseDateTo,
    {
      message: 'releaseDateFrom must be before or equal to releaseDateTo',
      path: ['releaseDateTo'],
    },
  );

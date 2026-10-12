import { z } from 'zod';
import { Certification } from '../../domain/enums/Certification';
import { MovieSortBy } from '../../application/query-params/MovieSortBy';
import { MovieStatus } from '../../application/query-params/MovieStatus';
import { SortOrder } from '../../application/query-params/SortOrder';

export const listMoviesForAdminSchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(50).default(12),

    search: z.string().trim().max(100).optional(),

    status: z.enum(MovieStatus).optional(),

    genreId: z.string().trim().min(1).optional(),

    languageId: z.string().trim().min(1).optional(),

    certification: z.enum(Certification).optional(),

    releaseStatus: z.enum(['NOW_SHOWING', 'UPCOMING']).optional(),

    releaseDateFrom: z.coerce.date().optional(),

    releaseDateTo: z.coerce
      .date()
      .transform((date) => {
        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999);
        return endOfDay;
      })
      .optional(),

    sortBy: z.enum(MovieSortBy).default(MovieSortBy.CREATED_AT),

    sortOrder: z.enum(SortOrder).default(SortOrder.DESC),
  })
  .refine(
    (data) =>
      !data.releaseDateFrom || !data.releaseDateTo || data.releaseDateFrom <= data.releaseDateTo,
    {
      message: 'releaseDateFrom must be before or equal to releaseDateTo',
      path: ['releaseDateTo'],
    },
  );

export type ListMoviesForAdminInput = z.infer<typeof listMoviesForAdminSchema>;

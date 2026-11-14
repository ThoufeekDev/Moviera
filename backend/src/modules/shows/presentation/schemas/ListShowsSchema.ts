import { z } from 'zod';
import { ShowStatus } from '../../domain/enums/ShowStatus';

export const listShowsQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: z
    .enum(['ALL', ShowStatus.DRAFT, ShowStatus.PUBLISHED, ShowStatus.CANCELLED])
    .default('ALL'),
  theatreId: z.string().trim().min(1).optional(),
  screenId: z.string().trim().min(1).optional(),
  movieId: z.string().trim().min(1).optional(),
  cinemaFormatId: z.string().trim().min(1).optional(),
  date: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional(),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type ListShowsQueryInput = z.infer<typeof listShowsQuerySchema>;


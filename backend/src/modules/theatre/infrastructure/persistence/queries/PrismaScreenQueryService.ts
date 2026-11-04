import type { Prisma, PrismaClient } from '@prisma/client';

import type {
  IScreenQueryService,
  ListScreensFilter,
} from '../../../application/ports/IScreenQueryService';

import type { ScreenListItem } from '../../../application/read-models/ScreenListItem';

import type { PaginatedResult } from '../../../../../shared/types/Pagination';

import { toPaginatedResult } from '../../../../../shared/utils/toPaginatedResult';
import { TheatreListSelect } from '../../select/TheatreListSelect';

export class PrismaScreenQueryService implements IScreenQueryService {
  constructor(private readonly prisma: PrismaClient) {}

  async listByTheatre(
    theatreId: string,
    filter?: ListScreensFilter,
  ): Promise<PaginatedResult<ScreenListItem>> {
    const page = Math.max(1, filter?.page ?? 1);
    const limit = Math.min(100, Math.max(1, filter?.limit ?? 20));
    const skip = (page - 1) * limit;

    const andConditions: Prisma.ScreenWhereInput[] = [{ theatreId }];

    const trimmedSearch = filter?.search?.trim();

    if (trimmedSearch) {
      andConditions.push({
        OR: [
          { name: { contains: trimmedSearch, mode: 'insensitive' } },
          { slug: { contains: trimmedSearch, mode: 'insensitive' } },
        ],
      });
    }

    if (filter?.status === 'ACTIVE') {
      andConditions.push({ isActive: true });
    } else if (filter?.status === 'INACTIVE') {
      andConditions.push({ isActive: false });
    }

    const where: Prisma.ScreenWhereInput = {
      AND: andConditions,
    };

    const [screens, total] = await Promise.all([
      this.prisma.screen.findMany({
        where,
        skip,
        take: limit,
        select: TheatreListSelect,
        orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      }),

      this.prisma.screen.count({ where }),
    ]);

    // Fetch distinct row labels for all screens on the current page.
    const screenIds = screens.map((screen) => screen.id);

    const seatRows = screenIds.length
      ? await this.prisma.seat.groupBy({
          by: ['screenId', 'rowLabel'],
          where: {
            screenId: {
              in: screenIds,
            },
          },
        })
      : [];

    // Calculate the number of rows for each screen.
    const rowCountByScreen = new Map<string, number>();

    for (const seatRow of seatRows) {
      rowCountByScreen.set(
        seatRow.screenId,
        (rowCountByScreen.get(seatRow.screenId) ?? 0) + 1,
      );
    }

    // Build screen list read models.
    const items: ScreenListItem[] = screens.map((screen) => {
      const totalSeats = screen._count.seats;

      return {
        id: screen.id,
        theatreId: screen.theatreId,
        name: screen.name,
        slug: screen.slug,
        isActive: screen.isActive,
        totalSeats,
        totalRows: rowCountByScreen.get(screen.id) ?? 0,
        totalShows: screen._count.shows,
        seatConfigurationStatus:
          totalSeats > 0 ? 'CONFIGURED' : 'NOT_CONFIGURED',
      };
    });

    return toPaginatedResult(items, total, page, limit);
  }
}
import type { PrismaClient } from '@prisma/client';

import type { IScreenQueryService } from '../../../application/ports/IScreenQueryService';
import type { ScreenListItem } from '../../../application/read-models/ScreenListItem';

import type { PaginatedResult } from '../../../../../shared/types/Pagination';
import { toPaginatedResult } from '../../../../../shared/utils/toPaginatedResult';
import { TheatreListSelect } from '../../select/TheatreListSelect';

export class PrismaScreenQueryService implements IScreenQueryService {
  constructor(private readonly prisma: PrismaClient) {}

  async listByTheatre(
    theatreId: string,
    filter?: { page?: number; limit?: number },
  ): Promise<PaginatedResult<ScreenListItem>> {
    const page = Math.max(1, filter?.page ?? 1);
    const limit = Math.min(100, Math.max(1, filter?.limit ?? 20));
    const skip = (page - 1) * limit;

    const where = {
      theatreId,
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

    const items: ScreenListItem[] = screens.map((screen) => ({
      id: screen.id,
      theatreId: screen.theatreId,
      name: screen.name,
      slug: screen.slug,
      isActive: screen.isActive,
      totalSeats: screen._count.seats,
      totalShows: screen._count.shows,
    }));
      
      return toPaginatedResult(items, total, page, limit);
  }
}

import {
  Prisma,
  PrismaClient,
  ShowSeatStatus,
  ShowStatus as PrismaShowStatus,
} from '@prisma/client';
import type { PaginatedResult } from '../../../../../shared/types/Pagination';
import type { SeatType } from '../../../../theatre';
import { ShowStatus } from '../../../domain/enums/ShowStatus';
import type {
  IShowQueryService,
  ListShowsQuery,
} from '../../../application/ports/IShowQueryService';
import type {
  ShowDetail,
  ShowSeatTierPricing,
} from '../../../application/read-models/ShowDetail';
import type { ShowListItem } from '../../../application/read-models/ShowListItem';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export class PrismaShowQueryService implements IShowQueryService {
  constructor(private readonly prisma: PrismaClient) {}

  async listShows(query: ListShowsQuery = {}): Promise<PaginatedResult<ShowListItem>> {
    const page = Math.max(1, query.page ?? DEFAULT_PAGE);
    const limit = Math.min(MAX_LIMIT, Math.max(1, query.limit ?? DEFAULT_LIMIT));
    const skip = (page - 1) * limit;

    const search = query.search?.trim();
    const status = query.status ?? 'ALL';

    const screenWhere: Prisma.ScreenWhereInput = {
      ...(query.theatreId ? { theatreId: query.theatreId } : {}),
      ...(query.theatreAdminUserId
        ? {
            theatre: {
              adminAssignments: {
                some: {
                  userId: query.theatreAdminUserId,
                  isActive: true,
                  user: {
                    isActive: true,
                  },
                },
              },
            },
          }
        : {}),
    };

    const startTimeFilter: Prisma.DateTimeFilter = {};

    if (query.date) {
      const dayStart = new Date(`${query.date}T00:00:00.000Z`);
      const dayEnd = new Date(`${query.date}T23:59:59.999Z`);
      if (!Number.isNaN(dayStart.getTime()) && !Number.isNaN(dayEnd.getTime())) {
        startTimeFilter.gte = dayStart;
        startTimeFilter.lte = dayEnd;
      }
    }

    if (query.fromDate) {
      startTimeFilter.gte = query.fromDate;
    }

    if (query.toDate) {
      startTimeFilter.lte = query.toDate;
    }

    const where: Prisma.ShowWhereInput = {
      ...(status !== 'ALL' ? { status: status as PrismaShowStatus } : {}),
      ...(query.screenId ? { screenId: query.screenId } : {}),
      ...(query.movieId ? { movieId: query.movieId } : {}),
      ...(query.cinemaFormatId ? { cinemaFormatId: query.cinemaFormatId } : {}),
      ...(Object.keys(screenWhere).length > 0 ? { screen: screenWhere } : {}),
      ...(Object.keys(startTimeFilter).length > 0 ? { startTime: startTimeFilter } : {}),
      ...(search
        ? {
            OR: [
              { movie: { title: { contains: search, mode: 'insensitive' } } },
              { screen: { name: { contains: search, mode: 'insensitive' } } },
              {
                screen: {
                  theatre: { name: { contains: search, mode: 'insensitive' } },
                },
              },
              { cinemaFormat: { name: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };

    const [rows, total] = await Promise.all([
      this.prisma.show.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ startTime: 'asc' }, { createdAt: 'desc' }],
        include: {
          movie: {
            select: {
              id: true,
              title: true,
              posterUrl: true,
              duration: true,
              certification: true,
              languages: {
                select: {
                  language: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
          screen: {
            select: {
              id: true,
              name: true,
              _count: {
                select: {
                  seats: {
                    where: { isActive: true },
                  },
                },
              },
              theatre: {
                select: {
                  id: true,
                  name: true,
                  city: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
          cinemaFormat: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      }),
      this.prisma.show.count({ where }),
    ]);

    const showIds = rows.map((row) => row.id);
    const seatCountsByShow = new Map<
      string,
      { totalSeats: number; availableSeats: number; bookedSeats: number }
    >();

    if (showIds.length > 0) {
      const groupedSeats = await this.prisma.showSeat.groupBy({
        by: ['showId', 'status'],
        where: {
          showId: { in: showIds },
        },
        _count: {
          id: true,
        },
      });

      for (const group of groupedSeats) {
        const current = seatCountsByShow.get(group.showId) ?? {
          totalSeats: 0,
          availableSeats: 0,
          bookedSeats: 0,
        };
        const count = group._count.id;
        current.totalSeats += count;

        if (group.status === ShowSeatStatus.AVAILABLE) {
          current.availableSeats += count;
        } else if (group.status === ShowSeatStatus.BOOKED) {
          current.bookedSeats += count;
        }

        seatCountsByShow.set(group.showId, current);
      }
    }

    const items: ShowListItem[] = rows.map((row) => {
      const seatSummary = seatCountsByShow.get(row.id) ?? {
        totalSeats: 0,
        availableSeats: 0,
        bookedSeats: 0,
      };

      return {
        id: row.id,
        status: row.status as ShowStatus,
        startTime: row.startTime,
        endTime: row.endTime,
        basePrice: row.basePrice,
        movie: {
          id: row.movie.id,
          title: row.movie.title,
          posterUrl: row.movie.posterUrl,
          duration: row.movie.duration,
          languages: row.movie.languages.map((l) => l.language.name),
          certification: row.movie.certification,
        },
        screen: {
          id: row.screen.id,
          name: row.screen.name,
          totalSeats: row.screen._count.seats,
        },
        theatre: {
          id: row.screen.theatre.id,
          name: row.screen.theatre.name,
          cityName: row.screen.theatre.city.name,
        },
        cinemaFormat: {
          id: row.cinemaFormat.id,
          name: row.cinemaFormat.name,
          slug: row.cinemaFormat.slug,
        },
        seatSummary,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      };
    });

    const totalPages = total === 0 ? 1 : Math.ceil(total / limit);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async findShowDetailById(showId: string): Promise<ShowDetail | null> {
    const row = await this.prisma.show.findUnique({
      where: { id: showId },
      include: {
        movie: {
          select: {
            id: true,
            title: true,
            posterUrl: true,
            duration: true,
            certification: true,
            isActive: true,
            languages: {
              select: {
                language: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        screen: {
          select: {
            id: true,
            name: true,
            isActive: true,
            _count: {
              select: {
                seats: {
                  where: { isActive: true },
                },
              },
            },
            theatre: {
              select: {
                id: true,
                name: true,
                cleaningBufferMinutes: true,
                isActive: true,
                city: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        cinemaFormat: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        showSeats: {
          select: {
            price: true,
            priceAdjustment: true,
            status: true,
            seat: {
              select: {
                type: true,
              },
            },
          },
        },
      },
    });

    if (!row) return null;

    let totalSeats = 0;
    let availableSeats = 0;
    let bookedSeats = 0;
    let minPrice = row.showSeats.length > 0 ? Number.POSITIVE_INFINITY : row.basePrice;
    let maxPrice = row.showSeats.length > 0 ? 0 : row.basePrice;

    const tiersMap = new Map<SeatType, ShowSeatTierPricing>();

    for (const showSeat of row.showSeats) {
      totalSeats += 1;
      const isAvailable = showSeat.status === ShowSeatStatus.AVAILABLE;
      const isBooked = showSeat.status === ShowSeatStatus.BOOKED;

      if (isAvailable) availableSeats += 1;
      if (isBooked) bookedSeats += 1;

      if (showSeat.price < minPrice) minPrice = showSeat.price;
      if (showSeat.price > maxPrice) maxPrice = showSeat.price;

      const seatType = showSeat.seat.type as SeatType;
      const existingTier = tiersMap.get(seatType);

      if (!existingTier) {
        tiersMap.set(seatType, {
          seatType,
          priceAdjustment: showSeat.priceAdjustment,
          finalPrice: showSeat.price,
          totalSeats: 1,
          availableSeats: isAvailable ? 1 : 0,
          bookedSeats: isBooked ? 1 : 0,
        });
      } else {
        existingTier.totalSeats += 1;
        if (isAvailable) existingTier.availableSeats += 1;
        if (isBooked) existingTier.bookedSeats += 1;
      }
    }

    return {
      id: row.id,
      status: row.status as ShowStatus,
      startTime: row.startTime,
      endTime: row.endTime,
      basePrice: row.basePrice,
      movie: {
        id: row.movie.id,
        title: row.movie.title,
        posterUrl: row.movie.posterUrl,
        duration: row.movie.duration,
        languages: row.movie.languages.map((l) => l.language.name),
        certification: row.movie.certification,
        isActive: row.movie.isActive,
      },
      screen: {
        id: row.screen.id,
        name: row.screen.name,
        totalSeats: row.screen._count.seats,
        isActive: row.screen.isActive,
      },
      theatre: {
        id: row.screen.theatre.id,
        name: row.screen.theatre.name,
        cityName: row.screen.theatre.city.name,
        cleaningBufferMinutes: row.screen.theatre.cleaningBufferMinutes,
        isActive: row.screen.theatre.isActive,
      },
      cinemaFormat: {
        id: row.cinemaFormat.id,
        name: row.cinemaFormat.name,
        slug: row.cinemaFormat.slug,
      },
      pricing: {
        basePrice: row.basePrice,
        minPrice,
        maxPrice,
        tiers: Array.from(tiersMap.values()),
      },
      seatInventorySummary: {
        totalSeats,
        availableSeats,
        bookedSeats,
      },
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}

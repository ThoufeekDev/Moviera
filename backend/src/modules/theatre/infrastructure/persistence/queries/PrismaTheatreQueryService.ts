import { PrismaClient } from '@prisma/client';
import { ITheatreQueryService } from '../../../application/ports/ITheatreQueryService';
import { TheatreOverview } from '../../../application/read-models/TheatreOverview';
import { TheatreWithCity } from '../../../application/read-models/TheatreWithCity';
import { TheatreMapper } from '../mappers/TheatreMapper';
import { TheatreOverviewFacilityMapper } from '../mappers/TheatreOverviewFacilityMapper';

export class PrismaTheatreQueryService implements ITheatreQueryService {
  constructor(private readonly prisma: PrismaClient) {}

  async findByAdminId(adminId: string): Promise<TheatreWithCity[]> {
    const assignments = await this.prisma.theatreAdminAssignment.findMany({
      where: {
        userId: adminId,
        isActive: true,
        theatre: {
          isActive: true,
        },
      },
      include: {
        theatre: {
          include: {
            city: true,
          },
        },
      },
    });

    return assignments.map((assignment) => ({
      theatre: TheatreMapper.toDomain(assignment.theatre),
      city: assignment.theatre.city,
    }));
  }

  async getOverview(theatreId: string, adminId: string): Promise<TheatreOverview | null> {
    const assignment = await this.prisma.theatreAdminAssignment.findFirst({
      where: {
        theatreId,
        userId: adminId,
        isActive: true,
        theatre: {
          isActive: true,
        },
      },
      include: {
        theatre: {
          include: {
            city: true,
            facilities: {
              include: {
                facility: true,
              },
            },
            screens: {
              include: {
                _count: {
                  select: {
                    seats: true,
                    shows: true,
                  },
                },
              },
            },
            _count: {
              select: {
                reviews: true,
              },
            },
          },
        },
      },
    });

    if (!assignment) return null;

    const theatre = assignment.theatre;

    const totalScreens = theatre.screens.length;

    const totalSeats = theatre.screens.reduce((total, screen) => {
      return total + screen._count.seats;
    }, 0);

    const totalShows = theatre.screens.reduce((total, screen) => {
      return total + screen._count.shows;
    }, 0);

    const totalReviews = theatre._count.reviews;

    const reviewAggregate = await this.prisma.theatreReview.aggregate({
      where: {
        theatreId,
      },
      _avg: {
        rating: true,
      },
    });

    return {
      theatre: {
        theatre: TheatreMapper.toDomain(theatre),
        city: theatre.city,
      },

      statistics: {
        totalScreens,
        totalSeats,
        totalShows,
      },

      facilities: TheatreOverviewFacilityMapper.toDomainList(theatre.facilities),

      reviews: {
        averageRating: reviewAggregate._avg.rating ?? 0,
        totalReviews,
      },
    };
  }
}

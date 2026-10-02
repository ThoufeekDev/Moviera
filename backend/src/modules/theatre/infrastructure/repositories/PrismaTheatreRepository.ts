import { Theatre } from '../../domain/entities/theatre.entity';
import prisma from '../../../../config/database';

import { ITheatreRepository } from '../../domain/repositories/ITheatreRepository';
import { TheatreMapper } from '../mappers/TheatreMapper';
import type { TheatreWithCity } from '../../domain/types/TheatreWithCity';
import type { TheatreOverview } from '../../domain/types/TheatreOverView';
import { TheatreOverviewFacilityMapper } from '../mappers/TheatreOverviewFacilityMapper';

export class PrismaTheatreRepository implements ITheatreRepository {
  async findById(id: string): Promise<Theatre | null> {
    const theatre = await prisma.theatre.findUnique({
      where: {
        id,
      },
    });

    return theatre ? TheatreMapper.toDomain(theatre) : null;
  }

  async findByAdminId(adminId: string): Promise<TheatreWithCity[]> {
    const assignments = await prisma.theatreAdminAssignment.findMany({
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

  async getOverView(theatreId: string, adminId: string): Promise<TheatreOverview | null> {
    const assignment = await prisma.theatreAdminAssignment.findFirst({
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
      return (total += screen._count.seats);
    }, 0);

    const totalShows = theatre.screens.reduce((total, screen) => {
      return (total += screen._count.shows);
    }, 0);

    const totalReviews = theatre._count.reviews;

    const reviewAggregate = await prisma.theatreReview.aggregate({
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

import { PrismaClient } from '@prisma/client';
import { ITheatreQueryService } from '../../../application/ports/ITheatreQueryService';
import { SuperAdminTheatreListItem } from '../../../application/read-models/SuperAdminTheatreListItem';
import { TheatreOverview } from '../../../application/read-models/TheatreOverview';
import { TheatreWithCity } from '../../../application/read-models/TheatreWithCity';
import { TheatreAdminAssignmentRole } from '../../../domain/enums/TheatreAdminAssignmentRole';
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

  async listForSuperAdmin(filter?: {
    search?: string;
    city?: string;
    status?: 'ALL' | 'ASSIGNED' | 'UNASSIGNED';
    limit?: number;
    page?: number;
  }): Promise<SuperAdminTheatreListItem[]> {
    const where: any = {};

    if (filter?.search) {
      where.OR = [
        { name: { contains: filter.search, mode: 'insensitive' } },
        { address: { contains: filter.search, mode: 'insensitive' } },
        { city: { name: { contains: filter.search, mode: 'insensitive' } } },
        { email: { contains: filter.search, mode: 'insensitive' } },
        { phone: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    if (filter?.city && filter.city !== 'ALL') {
      where.city = {
        name: { equals: filter.city, mode: 'insensitive' },
      };
    }

    if (filter?.status === 'ASSIGNED') {
      where.adminAssignments = {
        some: {},
      };
    } else if (filter?.status === 'UNASSIGNED') {
      where.adminAssignments = {
        none: {},
      };
    }

    const limit = filter?.limit ?? 50;
    const page = filter?.page ?? 1;
    const skip = (page - 1) * limit;

    const theatres = await this.prisma.theatre.findMany({
      where,
      take: limit,
      skip,
      include: {
        city: true,
        screens: {
          include: {
            _count: {
              select: {
                seats: true,
              },
            },
          },
        },
        adminAssignments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return theatres.map((theatre) => {
      const screensCount = theatre.screens.length;
      const totalSeats = theatre.screens.reduce((total, s) => total + s._count.seats, 0);

      const assignedAdmins = theatre.adminAssignments.map((a) => ({
        id: a.id,
        userId: a.userId,
        name: a.user.name,
        email: a.user.email,
        phone: a.user.phone,
        avatar: a.user.avatar,
        role: ((a as { role?: TheatreAdminAssignmentRole }).role ||
          TheatreAdminAssignmentRole.OPERATIONS_SUPERVISOR) as TheatreAdminAssignmentRole,
        isActive: a.isActive,
        assignedAt: a.createdAt,
      }));

      return {
        id: theatre.id,
        name: theatre.name,
        slug: theatre.slug,
        address: theatre.address,
        city: {
          id: theatre.city.id,
          name: theatre.city.name,
        },
        phone: theatre.phone,
        email: theatre.email,
        licenseNumber: theatre.licenseNumber,
        isActive: theatre.isActive,
        screensCount,
        totalSeats,
        assignedAdminsCount: assignedAdmins.length,
        assignedAdmins,
        createdAt: theatre.createdAt,
        updatedAt: theatre.updatedAt,
      };
    });
  }
}

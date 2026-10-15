import { Prisma, PrismaClient } from '@prisma/client';
import { ITheatreQueryService } from '../../../application/ports/ITheatreQueryService';
import { SuperAdminTheatreListItem } from '../../../application/read-models/SuperAdminTheatreListItem';
import { TheatreOverview } from '../../../application/read-models/TheatreOverview';
import { TheatreWithCity } from '../../../application/read-models/TheatreWithCity';
import { TheatreAdminAssignmentRole } from '../../../domain/enums/TheatreAdminAssignmentRole';
import { TheatreMapper } from '../mappers/TheatreMapper';
import { TheatreOverviewFacilityMapper } from '../mappers/TheatreOverviewFacilityMapper';
import { SuperAdminListTheatresItems } from '../../../application/read-models/SuperAdminListTheatresItems';
import { CityOption } from '../../../application/read-models/CityOption';
import { PaginatedResult } from '../../../../../shared/types/Pagination';
import { toPaginatedResult } from '../../../../../shared/utils/toPaginatedResult';

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



  async ListAllTheatres(filter?: {
    search?: string;
    status?: 'ALL' | 'ACTIVE' | 'INACTIVE';
    limit?: number;
    page?: number;
  }): Promise<PaginatedResult<SuperAdminListTheatresItems>> {
    const page = Math.max(1, filter?.page ?? 1);
    const limit = Math.min(100, Math.max(1, filter?.limit ?? 20));
    const skip = (page - 1) * limit;

    const andConditions: Prisma.TheatreWhereInput[] = [];

    const trimmedSearch = filter?.search?.trim();
    if (trimmedSearch) {
      andConditions.push({
        OR: [
          { name: { contains: trimmedSearch, mode: 'insensitive' } },
          { email: { contains: trimmedSearch, mode: 'insensitive' } },
          { licenseNumber: { contains: trimmedSearch, mode: 'insensitive' } },
        ],
      });
    }

    if (filter?.status === 'ACTIVE') {
      andConditions.push({ isActive: true });
    } else if (filter?.status === 'INACTIVE') {
      andConditions.push({ isActive: false });
    }

    const where: Prisma.TheatreWhereInput =
      andConditions.length > 0 ? { AND: andConditions } : {};

    const [theatres, total] = await Promise.all([
      this.prisma.theatre.findMany({
        where,
        take: limit,
        skip,
        select: {
          id: true,
          name: true,
          slug: true,
          email: true,
          phone: true,
          logoUrl: true,
          address: true,
          licenseNumber: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          city: {
            select: {
              id: true,
              name: true,
              state: true,
            },
          },
          _count: {
            select: {
              screens: true,
            },
          },
        },
        orderBy: [
          { createdAt: 'desc' },
          { id: 'asc' },
        ],
      }),
      this.prisma.theatre.count({ where }),
    ]);

    const items: SuperAdminListTheatresItems[] = theatres.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      email: t.email,
      phone: t.phone,
      logoUrl: t.logoUrl,
      address: t.address,
      licenseNumber: t.licenseNumber,
      isActive: t.isActive,
      totalScreens: t._count.screens,
      city: t.city,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));

    return toPaginatedResult(items, total, page, limit);
  }

  async listCities(): Promise<CityOption[]> {
    return this.prisma.city.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        state: true,
      },
      orderBy: [
        { name: 'asc' },
        { state: 'asc' },
        { id: 'asc' },
      ],
    });
  }
}


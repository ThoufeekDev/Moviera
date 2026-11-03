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
import { SuperAdminFacilityListItem } from '../../../application/read-models/SuperAdminFacilityListItem';
import { ActiveFacilityOption } from '../../../application/read-models/ActiveFacilityOption';
import { SuperAdminTheatreDetail } from '../../../application/read-models/SuperAdminTheatreDetail';
import { PaginatedResult } from '../../../../../shared/types/Pagination';
import { toPaginatedResult } from '../../../../../shared/utils/toPaginatedResult';

export class PrismaTheatreQueryService implements ITheatreQueryService {
  constructor(private readonly prisma: PrismaClient) {}

  async findByAdminId(adminId: string): Promise<TheatreWithCity[]> {
    const assignments = await this.prisma.theatreAdminAssignment.findMany({
      where: {
        userId: adminId,
        isActive: true,
        user: {
          isActive:true,
        },
        theatre: {
          deletedAt:null,
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
        user: {
          isActive:true,
        },
        theatre: {
          isActive: true,
          deletedAt:null,
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
    const where: Prisma.TheatreWhereInput = {
      deletedAt: null,
    };

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

    const where: Prisma.TheatreWhereInput = {
      deletedAt: null,
      ...(andConditions.length > 0 ?{AND:andConditions}:{})
    }

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

  async listFacilities(filter?: {
    search?: string;
    status?: 'ALL' | 'ACTIVE' | 'INACTIVE';
    limit?: number;
    page?: number;
  }): Promise<PaginatedResult<SuperAdminFacilityListItem>> {
    const page = Math.max(1, filter?.page ?? 1);
    const limit = Math.min(100, Math.max(1, filter?.limit ?? 10));
    const skip = (page - 1) * limit;

    const andConditions: Prisma.TheatreFacilityWhereInput[] = [];

    const trimmedSearch = filter?.search?.trim();
    if (trimmedSearch) {
      andConditions.push({
        OR: [
          { name: { contains: trimmedSearch, mode: 'insensitive' } },
          { description: { contains: trimmedSearch, mode: 'insensitive' } },
        ],
      });
    }

    if (filter?.status === 'ACTIVE') {
      andConditions.push({ isActive: true });
    } else if (filter?.status === 'INACTIVE') {
      andConditions.push({ isActive: false });
    }

    const where: Prisma.TheatreFacilityWhereInput =
      andConditions.length > 0 ? { AND: andConditions } : {};

    const [facilities, total] = await Promise.all([
      this.prisma.theatreFacility.findMany({
        where,
        take: limit,
        skip,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          iconKey: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              assignments: true,
            },
          },
        },
        orderBy: [{ name: 'asc' }, { id: 'asc' }],
      }),
      this.prisma.theatreFacility.count({ where }),
    ]);

    const items: SuperAdminFacilityListItem[] = facilities.map((f) => ({
      id: f.id,
      name: f.name,
      slug: f.slug,
      description: f.description,
      iconKey: f.iconKey,
      isActive: f.isActive,
      assignedTheatreCount: f._count.assignments,
      createdAt: f.createdAt,
      updatedAt: f.updatedAt,
    }));

    return toPaginatedResult(items, total, page, limit);
  }

  async listActiveFacilities(): Promise<ActiveFacilityOption[]> {
    return this.prisma.theatreFacility.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        iconKey: true,
      },
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
    });
  }

  async getTheatreDetailForSuperAdmin(identifier: string): Promise<SuperAdminTheatreDetail | null> {
    const theatre = await this.prisma.theatre.findFirst({
      where: {
        deletedAt: null,
        OR: [{ id: identifier }, { slug: identifier }],
      },
      include: {
        city: true,
        area: true,
        facilities: {
          include: {
            facility: true,
          },
        },
        screens: {
          include: {
            cinemaFormats: {
              include: {
                cinemaFormat: true,
              },
            },
            _count: {
              select: {
                seats: {
                  where: {
                    isActive: true,
                  },
                },
                shows: true,
              },
            },
          },
          orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
        },
        adminAssignments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
          orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
        },
      },
    });

    if (!theatre || theatre.deletedAt) {
      return null;
    }

    const now = new Date();
    const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
    const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0));

    const [todayShowsCount, todayBookingsCount, createdByUser] = await Promise.all([
      this.prisma.show.count({
        where: {
          screen: {
            theatreId: theatre.id,
          },
          startTime: {
            gte: startOfDay,
            lt: endOfDay,
          },
        },
      }),
      this.prisma.booking.count({
        where: {
          show: {
            screen: {
              theatreId: theatre.id,
            },
          },
          createdAt: {
            gte: startOfDay,
            lt: endOfDay,
          },
        },
      }),
      theatre.createdById
        ? this.prisma.user.findUnique({
            where: { id: theatre.createdById },
            select: { name: true, email: true },
          })
        : null,
    ]);

    const totalScreens = theatre.screens.length;
    const totalSeats = theatre.screens.reduce((sum, s) => sum + s._count.seats, 0);

    const activityHistory: SuperAdminTheatreDetail['activityHistory'] = [];

    activityHistory.push({
      id: `act-theatre-created-${theatre.id}`,
      type: 'THEATRE_CREATED',
      title: 'Theatre Registered',
      description: `Theatre "${theatre.name}" was registered in ${theatre.city.name}`,
      performedBy: createdByUser?.name || 'Super Admin',
      timestamp: theatre.createdAt.toISOString(),
    });

    if (theatre.updatedAt.getTime() - theatre.createdAt.getTime() > 2000) {
      activityHistory.push({
        id: `act-theatre-updated-${theatre.id}`,
        type: 'THEATRE_UPDATED',
        title: 'Theatre Information Updated',
        description: 'Theatre details and configuration were updated',
        performedBy: 'Super Admin',
        timestamp: theatre.updatedAt.toISOString(),
      });
    }

    theatre.screens.forEach((screen) => {
      activityHistory.push({
        id: `act-screen-created-${screen.id}`,
        type: 'SCREEN_CREATED',
        title: 'Screen Added',
        description: `Screen "${screen.name}" (${screen._count.seats} seats) added to theatre`,
        performedBy: 'Theatre Management',
        timestamp: screen.createdAt.toISOString(),
      });
      if (screen.updatedAt.getTime() - screen.createdAt.getTime() > 2000) {
        activityHistory.push({
          id: `act-screen-updated-${screen.id}`,
          type: 'SCREEN_UPDATED',
          title: 'Screen Updated',
          description: `Screen "${screen.name}" configuration updated`,
          performedBy: 'Theatre Management',
          timestamp: screen.updatedAt.toISOString(),
        });
      }
    });

    theatre.adminAssignments.forEach((assignment) => {
      activityHistory.push({
        id: `act-admin-assigned-${assignment.id}`,
        type: 'ADMIN_ASSIGNED',
        title: 'Administrator Assigned',
        description: `${assignment.user.name} assigned as ${assignment.role.replace(/_/g, ' ')}`,
        performedBy: 'Super Admin',
        timestamp: assignment.createdAt.toISOString(),
      });
    });

    activityHistory.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return {
      id: theatre.id,
      name: theatre.name,
      slug: theatre.slug,
      address: theatre.address,
      description: theatre.description,
      logoUrl: theatre.logoUrl,
      email: theatre.email,
      phone: theatre.phone,
      latitude: theatre.latitude,
      longitude: theatre.longitude,
      pincode: theatre.pincode,
      landmark: theatre.landmark,
      googlePlaceId: theatre.googlePlaceId,
      isActive: theatre.isActive,
      licenseNumber: theatre.licenseNumber,
      createdAt: theatre.createdAt.toISOString(),
      updatedAt: theatre.updatedAt.toISOString(),
      createdById: theatre.createdById,
      createdByName: createdByUser?.name ?? null,

      city: {
        id: theatre.city.id,
        name: theatre.city.name,
        district: theatre.city.district,
        state: theatre.city.state,
        country: theatre.city.country,
      },

      area: theatre.area
        ? {
            id: theatre.area.id,
            name: theatre.area.name,
          }
        : null,

      statistics: {
        totalScreens,
        totalSeats,
        todayShows: todayShowsCount,
        todayBookings: todayBookingsCount,
      },

      screens: theatre.screens.map((screen) => ({
        id: screen.id,
        name: screen.name,
        slug: screen.slug,
        isActive: screen.isActive,
        cinemaFormats: screen.cinemaFormats.map((cf) => ({
          id: cf.cinemaFormat.id,
          name: cf.cinemaFormat.name,
        })),
        seatingCapacity: screen._count.seats,
        createdAt: screen.createdAt.toISOString(),
        updatedAt: screen.updatedAt.toISOString(),
      })),

      facilities: theatre.facilities.map((f) => ({
        id: f.facility.id,
        name: f.facility.name,
        slug: f.facility.slug,
        description: f.facility.description,
        icon: f.facility.icon,
        iconKey: f.facility.iconKey,
      })),

      assignedAdmins: theatre.adminAssignments.map((a) => ({
        assignmentId: a.id,
        userId: a.user.id,
        name: a.user.name,
        email: a.user.email,
        phone: a.user.phone,
        role: a.role,
        isActive: a.isActive,
        assignedAt: a.createdAt.toISOString(),
      })),

      activityHistory,
    };
  }
}


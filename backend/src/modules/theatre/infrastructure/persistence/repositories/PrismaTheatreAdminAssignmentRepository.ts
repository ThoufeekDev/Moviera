import { Prisma,PrismaClient} from '@prisma/client';
import { TheatreAdminAssignmentRole } from '../../../domain/enums/TheatreAdminAssignmentRole';
import {
  ITheatreAdminAssignmentRepository,
  TheatreAdminAssignmentDetails,
  TheatreAdminAssignmentListItem,
  TheatreAdminAssignmentRecord,
  TheatreAdminStats,
} from '../../../domain/repositories/ITheatreAdminAssignmentRepository';

export class PrismaTheatreAdminAssignmentRepository implements ITheatreAdminAssignmentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByUserAndTheatre(
    userId: string,
    theatreId: string,
  ): Promise<TheatreAdminAssignmentRecord | null> {
    const record = await this.prisma.theatreAdminAssignment.findUnique({
      where: {
        userId_theatreId: {
          userId,
          theatreId,
        },
      },
    });

    if (!record) return null;

    return {
      id: record.id,
      userId: record.userId,
      theatreId: record.theatreId,
      isActive: record.isActive,
      role: (((record as any).role) || TheatreAdminAssignmentRole.OPERATIONS_SUPERVISOR) as TheatreAdminAssignmentRole,
    };
  }

  async findById(id: string): Promise<TheatreAdminAssignmentRecord | null> {
    const record = await this.prisma.theatreAdminAssignment.findUnique({
      where: { id },
    });

    if (!record) return null;

    return {
      id: record.id,
      userId: record.userId,
      theatreId: record.theatreId,
      isActive: record.isActive,
      role: (((record as any).role) || TheatreAdminAssignmentRole.OPERATIONS_SUPERVISOR) as TheatreAdminAssignmentRole,
    };
  }

  async create(
    userId: string,
    theatreId: string,
    role: TheatreAdminAssignmentRole,
  ): Promise<TheatreAdminAssignmentRecord> {
    const record = await this.prisma.theatreAdminAssignment.create({
      data: {
        userId,
        theatreId,
        role: role as any,
      },
    });

    return {
      id: record.id,
      userId: record.userId,
      theatreId: record.theatreId,
      isActive: record.isActive,
      role: (((record as any).role) || TheatreAdminAssignmentRole.OPERATIONS_SUPERVISOR) as TheatreAdminAssignmentRole,
    };
  }

  async updateActiveStatus(
    assignmentId: string,
    isActive: boolean,
  ): Promise<TheatreAdminAssignmentRecord> {
    const record = await this.prisma.theatreAdminAssignment.update({
      where: {
        id: assignmentId,
      },
      data: {
        isActive,
      },
    });

    return {
      id: record.id,
      userId: record.userId,
      theatreId: record.theatreId,
      isActive: record.isActive,
      role: (((record as any).role) || TheatreAdminAssignmentRole.OPERATIONS_SUPERVISOR) as TheatreAdminAssignmentRole,
    };
  }

  async updateAssignment(
    assignmentId: string,
    data: {
      isActive?: boolean;
      role?: TheatreAdminAssignmentRole;
    },
  ): Promise<TheatreAdminAssignmentRecord> {
    const record = await this.prisma.theatreAdminAssignment.update({
      where: { id: assignmentId },
      data: {
        ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
        ...(data.role !== undefined ? { role: data.role as any } : {}),
      },
    });

    return {
      id: record.id,
      userId: record.userId,
      theatreId: record.theatreId,
      isActive: record.isActive,
      role: (((record as any).role) || TheatreAdminAssignmentRole.OPERATIONS_SUPERVISOR) as TheatreAdminAssignmentRole,
    };
  }

  async delete(assignmentId: string): Promise<void> {
    await this.prisma.theatreAdminAssignment.delete({
      where: { id: assignmentId },
    });
  }

  async findActiveByTheatre(theatreId: string): Promise<TheatreAdminAssignmentRecord[]> {
    const records = await this.prisma.theatreAdminAssignment.findMany({
      where: {
        theatreId,
        isActive: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => ({
      id: record.id,
      userId: record.userId,
      theatreId: record.theatreId,
      isActive: record.isActive,
      role: (((record as any).role) || TheatreAdminAssignmentRole.OPERATIONS_SUPERVISOR) as TheatreAdminAssignmentRole,
    }));
  }

  async findAllByTheatre(theatreId: string): Promise<TheatreAdminAssignmentListItem[]> {
    return this.prisma.theatreAdminAssignment.findMany({
      where: { theatreId },
      select: {
        id: true,
        userId: true,
        theatreId: true,
        isActive: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async findAll(filter?: {
    theatreId?: string;
    role?: TheatreAdminAssignmentRole;
    isActive?: boolean;
    search?: string;
  }): Promise<TheatreAdminAssignmentDetails[]> {
    const where: Prisma.TheatreAdminAssignmentWhereInput = {
      theatre: {
         deletedAt:null,
      }
    };

    if (filter?.theatreId) {
      where.theatreId = filter.theatreId;
    }

    if (filter?.role) {
      where.role = filter.role;
    }

    if (filter?.isActive !== undefined) {
      where.isActive = filter.isActive;
    }

    if (filter?.search) {
      where.OR = [
        { user: { name: { contains: filter.search, mode: 'insensitive' } } },
        { user: { email: { contains: filter.search, mode: 'insensitive' } } },
        { theatre: { name: { contains: filter.search, mode: 'insensitive' } } },
      ];
    }

    const records = await this.prisma.theatreAdminAssignment.findMany({
      where,
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
        theatre: {
          select: {
            id: true,
            name: true,
            slug: true,
            city: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((r) => ({
      id: r.id,
      userId: r.userId,
      theatreId: r.theatreId,
      role: (((r as any).role) || TheatreAdminAssignmentRole.OPERATIONS_SUPERVISOR) as TheatreAdminAssignmentRole,
      isActive: r.isActive,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      user: {
        id: r.user.id,
        name: r.user.name,
        email: r.user.email,
        phone: r.user.phone,
        avatar: r.user.avatar,
      },
      theatre: {
        id: r.theatre.id,
        name: r.theatre.name,
        slug: r.theatre.slug,
        city: {
          id: r.theatre.city.id,
          name: r.theatre.city.name,
        },
      },
    }));
  }

  async findActivePrimaryManagerByTheatre(theatreId: string): Promise<TheatreAdminAssignmentRecord | null> {
    const record = await this.prisma.theatreAdminAssignment.findFirst({
      where: {
        theatreId,
        role: TheatreAdminAssignmentRole.PRIMARY_MANAGER,
        isActive: true,
      },
    });

    if (!record) return null;

    return {
      id: record.id,
      userId: record.userId,
      theatreId: record.theatreId,
      isActive: record.isActive,
      role: (((record as any).role) || TheatreAdminAssignmentRole.OPERATIONS_SUPERVISOR) as TheatreAdminAssignmentRole,
    };
  }

  async getStatistics(): Promise<TheatreAdminStats> {
    const [
      totalTheatres,
      assignedTheatresRaw,
      totalAdmins,
      activeAdmins,
      suspendedAdmins,
      citiesRaw,
    ] = await Promise.all([
      this.prisma.theatre.count({
        where: {
          deletedAt:null
        }
      }),
      this.prisma.theatreAdminAssignment.findMany({
        where: {
          theatre: {
            deletedAt:null,
          }
        },
        select: { theatreId: true },
        distinct: ['theatreId'],
      }),
      this.prisma.theatreAdminAssignment.count(),
      this.prisma.theatreAdminAssignment.count({ where: { isActive: true } }),
      this.prisma.theatreAdminAssignment.count({ where: { isActive: false } }),
      this.prisma.city.findMany({
        select: { name: true },
        orderBy: { name: 'asc' },
      }),
    ]);

    const assignedTheatres = assignedTheatresRaw.length;
    const unassignedTheatres = Math.max(0, totalTheatres - assignedTheatres);
    const cities = citiesRaw.map((c) => c.name);

    return {
      totalTheatres,
      assignedTheatres,
      unassignedTheatres,
      totalAdmins,
      activeAdmins,
      suspendedAdmins,
      cities,
    };
  }
}

import { PrismaClient, Prisma } from '@prisma/client';
import { Theatre } from '../../../domain/entities/Theatre';
import { ITheatreRepository } from '../../../domain/repositories/ITheatreRepository';
import { TheatreMapper } from '../mappers/TheatreMapper';
import { ConflictError } from '../../../../../shared/errors/ConflictError';

export class PrismaTheatreRepository implements ITheatreRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Theatre | null> {
    const theatre = await this.prisma.theatre.findUnique({
      where: {
        id,
        deletedAt:null,
      },
    });

    return theatre ? TheatreMapper.toDomain(theatre) : null;
  }

  async findByIdForAdmin(theatreId: string, adminId: string): Promise<Theatre | null> {
    const assignment = await this.prisma.theatreAdminAssignment.findFirst({
      where: {
        theatreId,
        userId: adminId,
        isActive: true,
        theatre: {
          isActive: true,
          deletedAt:null,
        },
      },
      include: {
        theatre: true,
      },
    });

    return assignment ? TheatreMapper.toDomain(assignment.theatre) : null;
  }

  async cityExists(cityId: string): Promise<boolean> {
    const count = await this.prisma.city.count({
      where: {
        id: cityId,
        isActive: true,
      },
    });
    return count > 0;
  }

  async findByNameAndCity(name: string, cityId: string): Promise<Theatre | null> {
    const theatre = await this.prisma.theatre.findFirst({
      where: {
        cityId,
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });

    return theatre ? TheatreMapper.toDomain(theatre) : null;
  }

  async findByLicenseNumber(licenseNumber: string): Promise<Theatre | null> {
   
    if (!licenseNumber) return null;

    const theatre = await this.prisma.theatre.findFirst({
      where: {
        licenseNumber: {
          equals: licenseNumber,
          mode: 'insensitive',
        },
      },
    });

    return theatre ? TheatreMapper.toDomain(theatre) : null;
  }

  async existsByCityAndSlug(cityId: string, slug: string): Promise<boolean> {
    const count = await this.prisma.theatre.count({
      where: {
        cityId,
        slug,
      },
    });
    return count > 0;
  }

  async create(theatre: Theatre, facilityIds: string[] = []): Promise<Theatre> {
  
    return this.prisma.$transaction(async (tx) => {
       const created = await tx.theatre.create({
    data: {
      ...(theatre.id ? { id: theatre.id } : {}),
      cityId: theatre.cityId,
      areaId: theatre.areaId,
      googlePlaceId: theatre.googlePlaceId,
      name: theatre.name,
      slug: theatre.slug,
      address: theatre.address,
      description: theatre.description,
      logoUrl: theatre.logoUrl,
      logoPublicId: theatre.logoPublicId,
      email: theatre.email,
      phone: theatre.phone,
      latitude: theatre.latitude,
      longitude: theatre.longitude,
      pincode: theatre.pincode,
      landmark: theatre.landmark,
      isActive: theatre.isActive,
      licenseNumber: theatre.licenseNumber,
      createdById: theatre.createdById,
      deletedAt: theatre.deletedAt,
    },
  });

  if (facilityIds.length > 0) {
    await tx.theatreFacilityAssignment.createMany({
      data: facilityIds.map((facilityId) => ({
        theatreId: created.id,
        facilityId
      }))
    });
  }
      return TheatreMapper.toDomain(created);
    })
 

  
}
}

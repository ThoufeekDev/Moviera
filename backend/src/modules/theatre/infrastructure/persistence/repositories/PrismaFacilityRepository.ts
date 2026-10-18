import { PrismaClient, Prisma } from '@prisma/client';
import { ConflictError } from '../../../../../shared/errors/ConflictError';
import { Facility } from '../../../domain/entities/Facility';
import { IFacilityRepository } from '../../../domain/repositories/IFacilityRepository';

export class PrismaFacilityRepository implements IFacilityRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Facility | null> {
    const raw = await this.prisma.theatreFacility.findUnique({
      where: { id },
    });
    return raw ? this.toDomain(raw) : null;
  }

  async findActiveByIds(ids: string[]): Promise<Facility[]> {
    if (!ids || ids.length === 0) {
      return [];
    }

    const raw = await this.prisma.theatreFacility.findMany({
      where: {
        id: { in: ids },
        isActive: true,
      },
    });

    return raw.map((item) => this.toDomain(item));
  }

  async findByName(name: string): Promise<Facility | null> {
    const raw = await this.prisma.theatreFacility.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });
    return raw ? this.toDomain(raw) : null;
  }

  async findBySlug(slug: string): Promise<Facility | null> {
    const raw = await this.prisma.theatreFacility.findUnique({
      where: { slug },
    });
    return raw ? this.toDomain(raw) : null;
  }

  async existsByName(name: string, excludeId?: string): Promise<boolean> {
    const count = await this.prisma.theatreFacility.count({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    });
    return count > 0;
  }

  async existsBySlug(slug: string): Promise<boolean> {
    const count = await this.prisma.theatreFacility.count({
      where: { slug },
    });
    return count > 0;
  }

  async create(facility: Facility): Promise<Facility> {
    try {
      const created = await this.prisma.theatreFacility.create({
        data: {
          ...(facility.id ? { id: facility.id } : {}),
          name: facility.name,
          slug: facility.slug,
          description: facility.description,
          iconKey: facility.iconKey,
          isActive: facility.isActive,
        },
      });

      return this.toDomain(created);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const target = String(error.meta?.target || '');
        if (target.includes('name')) {
          throw new ConflictError('A facility with this name already exists.');
        }
        if (target.includes('slug')) {
          throw new ConflictError('A facility with this slug already exists.');
        }
        throw new ConflictError('A facility with these unique details already exists.');
      }
      throw error;
    }
  }

  async update(facility: Facility): Promise<Facility> {
    try {
      const updated = await this.prisma.theatreFacility.update({
        where: { id: facility.id },
        data: {
          name: facility.name,
          description: facility.description,
          iconKey: facility.iconKey,
          isActive: facility.isActive,
        },
      });

      return this.toDomain(updated);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const target = String(error.meta?.target || '');
        if (target.includes('name')) {
          throw new ConflictError('A facility with this name already exists.');
        }
        if (target.includes('slug')) {
          throw new ConflictError('A facility with this slug already exists.');
        }
        throw new ConflictError('A facility with these unique details already exists.');
      }
      throw error;
    }
  }

  private toDomain(raw: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    icon?: string | null;
    iconKey?: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Facility {
    return Facility.create({
      id: raw.id,
      name: raw.name,
      slug: raw.slug,
      description: raw.description,
      icon: raw.icon ?? null,
      iconKey: raw.iconKey ?? null,
      isActive: raw.isActive,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}


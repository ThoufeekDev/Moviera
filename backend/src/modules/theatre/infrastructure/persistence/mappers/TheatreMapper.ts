import { Theatre as PrismaTheatre } from '@prisma/client';
import { Theatre } from '../../../domain/entities/Theatre';
import { TheatreProps } from '../../../domain/types/TheatreProps';

export class TheatreMapper {
  static toDomain(data: PrismaTheatre | TheatreProps): Theatre {
    return Theatre.create({
      id: data.id,
      cityId: data.cityId,
      areaId: data.areaId,
      googlePlaceId:data.googlePlaceId,
      name: data.name,
      slug: data.slug,
      address: data.address,
      description: data.description,
      logoUrl: data.logoUrl,
      logoPublicId: data.logoPublicId,
      email: data.email,
      phone: data.phone,
      latitude: data.latitude,
      longitude: data.longitude,
      pincode: data.pincode,
      landmark: data.landmark,
      isActive: data.isActive,
      licenseNumber: data.licenseNumber,
      createdById: data.createdById,
      deletedAt: data.deletedAt,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}

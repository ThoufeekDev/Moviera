import { Theatre } from "../../domain/entities/theatre.entity";
import type { TheatreWithCity } from "../../domain/types/TheatreWithCity";

export class TheatreResponseMapper {
    static toResponse(theatre: Theatre,city:TheatreWithCity['city']) {
        return {
      id: theatre.id,
      cityId: theatre.cityId,
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
      isActive: theatre.isActive,
      licenseNumber: theatre.licenseNumber,
      createdAt: theatre.createdAt,
            updatedAt: theatre.updatedAt,
      city
        }
    }

  static toResponseList(theatres: TheatreWithCity[]) {
    return theatres.map(({ theatre, city }) =>
      this.toResponse(theatre, city),
    );
  }
}
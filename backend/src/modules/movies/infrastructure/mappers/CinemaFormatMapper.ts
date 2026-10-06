import { CinemaFormat } from "../../domain/entities/CinemaFormat";

export class CinemaFormatMapper {
  static toDomain(data: {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): CinemaFormat {
    return new CinemaFormat(
      data.id,
      data.name,
      data.slug,
      data.isActive,
      data.createdAt,
      data.updatedAt
    );
  }

  static toDomainList(
    data: {
      id: string;
      name: string;
      slug: string;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
    }[]
  ): CinemaFormat[] {
    return data.map((cinemaFormat) => this.toDomain(cinemaFormat));
  }
}
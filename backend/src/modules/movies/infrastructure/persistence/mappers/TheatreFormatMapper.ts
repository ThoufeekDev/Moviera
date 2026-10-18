import { TheatreFormat } from "../../../domain/entities/TheatreFormat";

export class TheatreFormatMapper {
  static toDomain(data: {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): TheatreFormat {
    return new TheatreFormat(
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
  ): TheatreFormat[] {
    return data.map((theatreFormat) => this.toDomain(theatreFormat));
  }
}
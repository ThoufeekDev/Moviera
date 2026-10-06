import { Genre } from "../../domain/entities/Genre";

export class GenreMapper {
  static toDomain(data: {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Genre {
    return new Genre(
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
  ): Genre[] {
    return data.map((genre) => this.toDomain(genre));
  }
}
import { PrismaClient } from "@prisma/client";
import { Genre } from "../../../domain/entities/Genre";
import { IGenreRepository } from "../../../domain/repositories/IGenreRepository";
import { GenreMapper } from "../mappers/GenreMapper";

export class PrismaGenreRepository implements IGenreRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<Genre[]> {
    const genres = await this.prisma.genre.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return GenreMapper.toDomainList(genres);
  }

  async findByIds(ids: string[]): Promise<Genre[]> {
    const genres = await this.prisma.genre.findMany({
      where: {
        id: {
          in: ids,
        },
        isActive: true,
      },
    });

    return GenreMapper.toDomainList(genres);
  }
}
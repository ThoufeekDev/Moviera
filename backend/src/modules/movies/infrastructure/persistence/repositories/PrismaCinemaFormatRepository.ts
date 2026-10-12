import { PrismaClient } from '@prisma/client';
import { CinemaFormat } from '../../../domain/entities/CinemaFormat';
import { ICinemaFormatRepository } from '../../../domain/repositories/ICinemaFormatRepository';
import { CinemaFormatMapper } from '../mappers/CinemaFormatMapper';

export class PrismaCinemaFormatRepository implements ICinemaFormatRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<CinemaFormat[]> {
    const cinemaFormats = await this.prisma.cinemaFormat.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return CinemaFormatMapper.toDomainList(cinemaFormats);
  }

  async findByIds(ids: string[]): Promise<CinemaFormat[]> {
    const cinemaFormats = await this.prisma.cinemaFormat.findMany({
      where: {
        id: {
          in: ids,
        },
        isActive: true,
      },
    });

    return CinemaFormatMapper.toDomainList(cinemaFormats);
  }
}

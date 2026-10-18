import { PrismaClient } from '@prisma/client';
import { TheatreFormat } from '../../../domain/entities/TheatreFormat';
import { ITheatreFormatRepository } from '../../../domain/repositories/ITheatreFormatRepository';
import { TheatreFormatMapper } from '../mappers/TheatreFormatMapper';

export class PrismaTheatreFormatRepository implements ITheatreFormatRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<TheatreFormat[]> {
    const cinemaFormats = await this.prisma.cinemaFormat.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return TheatreFormatMapper.toDomainList(cinemaFormats);
  }

  async findByIds(ids: string[]): Promise<TheatreFormat[]> {
    const cinemaFormats = await this.prisma.cinemaFormat.findMany({
      where: {
        id: {
          in: ids,
        },
        isActive: true,
      },
    });

    return TheatreFormatMapper.toDomainList(cinemaFormats);
  }
}

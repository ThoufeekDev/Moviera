import { PrismaClient } from '@prisma/client';
import { Screen } from '../../../domain/entities/Screen';
import { IScreenRepository } from '../../../domain/repositories/IScreenRepository';
import type { CreateScreenProps } from '../../../domain/types/CreateScreenProps';
import { ScreenMapper } from '../mappers/ScreenMapper';

export class PrismaScreenRepository implements IScreenRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Screen | null> {
    const screen = await this.prisma.screen.findUnique({
      where: {
        id,
      },
    });

    return screen ? ScreenMapper.toDomain(screen) : null;
  }

  async findByName(theatreId: string, name: string): Promise<Screen | null> {
    const screen = await this.prisma.screen.findFirst({
      where: {
        theatreId,
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });

    return screen ? ScreenMapper.toDomain(screen) : null;
  }

  async create(screen: CreateScreenProps): Promise<Screen> {
    const createdScreen = await this.prisma.screen.create({
      data: {
        theatreId: screen.theatreId,
        name: screen.name,
        slug: screen.slug,
      },
    });

    return ScreenMapper.toDomain(createdScreen);
  }
}

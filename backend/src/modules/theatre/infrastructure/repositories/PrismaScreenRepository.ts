import prisma from '../../../../config/database';
import { Screen } from '../../domain/entities/screen.entity';
import { IScreenRepository } from '../../domain/repositories/IScreenRepository';
import type { CreateScreenProps } from '../../domain/types/CreateScreenProps';
import { ScreenMapper } from '../mappers/ScreenMapper';

export class PrismaScreenRepository implements IScreenRepository {
  async findById(id: string): Promise<Screen | null> {
    const screen = await prisma.screen.findUnique({
      where: {
        id,
      },
    });

    return screen ? ScreenMapper.toDomain(screen) : null;
  }

  async findByName(theatreId: string, name: string): Promise<Screen | null> {
    const screen = await prisma.screen.findFirst({
      where: {
        theatreId,
        name: {
          equals: name,
          mode:'insensitive'
        }
      },
    });

    return screen ? ScreenMapper.toDomain(screen) : null;
  }

  async create(screen: CreateScreenProps): Promise<Screen> {
    const createdScreen = await prisma.screen.create({
      data: {
        theatreId: screen.theatreId,
        name: screen.name,
        slug: screen.slug,
      },
    });

    return ScreenMapper.toDomain(createdScreen);
  }
}

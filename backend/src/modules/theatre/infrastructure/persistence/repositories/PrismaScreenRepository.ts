import { PrismaClient, Prisma } from '@prisma/client';
import { Screen } from '../../../domain/entities/Screen';
import { IScreenRepository } from '../../../domain/repositories/IScreenRepository';
import type { CreateScreenProps } from '../../../domain/types/CreateScreenProps';
import { ScreenMapper } from '../mappers/ScreenMapper';
import { Seat } from '../../../domain/entities/Seat';
import { CreateSeatProps } from '../../../domain/types/CreateSeatProps';
import { SeatMapper } from '../mappers/SeatMapper';
import type {
  IScreenDetailsReader,
  ScreenDetails,
} from '../../../application/ports/IScreenDetailsReader';
export class PrismaScreenRepository implements IScreenRepository,IScreenDetailsReader {
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

  async findBySlug(theatreId: string, slug: string): Promise<Screen | null> {
    const screen = await this.prisma.screen.findUnique({
      where: {
        theatreId_slug: { theatreId, slug },
      },
    });

    return screen ? ScreenMapper.toDomain(screen) : null;
  }

  async findActiveCinemaFormatIds(ids: string[]): Promise<string[]> {
    if (ids.length === 0) return [];

    const formats = await this.prisma.cinemaFormat.findMany({
      where: {
        id: { in: ids },
        isActive: true,
      },
      select: { id: true },
    });

    return formats.map((f) => f.id);
  }

  async create(screen: CreateScreenProps): Promise<Screen> {
    const cinemaFormatIds = screen.cinemaFormatIds ?? [];
    const createdScreen = await this.prisma.screen.create({
      data: {
        theatreId: screen.theatreId,
        name: screen.name,
        slug: screen.slug,
        ...(cinemaFormatIds.length > 0
          ? {
              cinemaFormats: {
                create: cinemaFormatIds.map((cinemaFormatId) => ({
                  cinemaFormatId,
                })),
              },
            }
          : {}),
      },
    });

    return ScreenMapper.toDomain(createdScreen);
  }

  async findScreenDetailsById(
    screenId: string,
  ): Promise<ScreenDetails | null> {
    const screen = await this.prisma.screen.findUnique({
      where: { id: screenId },
      select: {
        id: true,
        theatreId: true,
        isActive: true,
        theatre: {
          select: {
            isActive: true,
            deletedAt: true,
            cleaningBufferMinutes: true,
          },
        },
        cinemaFormats: {
          where: {
            cinemaFormat: {
              isActive: true,
            },
          },
          select: {
            cinemaFormatId: true,
          },
        },
      },
    });

    if (!screen) return null;

    return {
      id: screen.id,
      theatreId: screen.theatreId,
      isActive: screen.isActive,
      theatreIsActive: screen.theatre.isActive && screen.theatre.deletedAt === null,
      cleaningBufferMinutes: screen.theatre.cleaningBufferMinutes,
      cinemaFormatIds: screen.cinemaFormats.map((cf) => cf.cinemaFormatId),
    };
  }


}

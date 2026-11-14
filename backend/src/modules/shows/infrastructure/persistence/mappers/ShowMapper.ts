import type { Show as PrismaShow } from '@prisma/client';
import { Show } from '../../../domain/entities/Show';
import { ShowStatus } from '../../../domain/enums/ShowStatus';

export class ShowMapper {
  static toDomain(record: PrismaShow): Show {
    return Show.reconstitute({
      id: record.id,
      movieId: record.movieId,
      screenId: record.screenId,
      cinemaFormatId: record.cinemaFormatId,
      startTime: record.startTime,
      endTime: record.endTime,
      basePrice: record.basePrice,
      status: record.status as ShowStatus,
      isActive: record.isActive,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}

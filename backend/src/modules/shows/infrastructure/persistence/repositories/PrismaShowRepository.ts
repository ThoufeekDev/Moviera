import {
  BookingStatus,
  Prisma,
  PrismaClient,
  ShowStatus as PrismaShowStatus,
} from '@prisma/client';
import { ConflictError } from '../../../../../shared/errors/ConflictError';
import { DEFAULT_CLEANING_BUFFER_MINUTES } from '../../../domain/constants/ShowPricingConstants';
import type { Show } from '../../../domain/entities/Show';
import type {
  CheckScheduleConflictParams,
  IShowRepository,
  ShowSeatInventorySummary,
} from '../../../domain/repositories/IShowRepository';
import type { CreateShowData } from '../../../domain/types/CreateShowData';
import type { UpdateShowData } from '../../../domain/types/UpdateShowData';
import { ShowMapper } from '../mappers/ShowMapper';

type TransactionClient = Prisma.TransactionClient | PrismaClient;

export class PrismaShowRepository implements IShowRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private async lockScreenSchedule(
    tx: Prisma.TransactionClient,
    screenId: string,
  ): Promise<void> {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext('movira_shows_schedule'), hashtext(${screenId}))`;
  }

  private async checkConflictWithClient(
    client: TransactionClient,
    params: CheckScheduleConflictParams,
  ): Promise<boolean> {
    const bufferMs = Math.max(0, params.cleaningBufferMinutes) * 60_000;
    const windowStartWithBuffer = new Date(params.startTime.getTime() - bufferMs);
    const windowEndWithBuffer = new Date(params.endTime.getTime() + bufferMs);

    const conflictingShow = await client.show.findFirst({
      where: {
        screenId: params.screenId,
        status: {
          in: [PrismaShowStatus.DRAFT, PrismaShowStatus.PUBLISHED],
        },
        ...(params.excludeShowId ? { id: { not: params.excludeShowId } } : {}),
        startTime: {
          lt: windowEndWithBuffer,
        },
        endTime: {
          gt: windowStartWithBuffer,
        },
      },
      select: { id: true },
    });

    return Boolean(conflictingShow);
  }

  async findById(showId: string): Promise<Show | null> {
    const record = await this.prisma.show.findUnique({
      where: { id: showId },
    });

    if (!record) return null;
    return ShowMapper.toDomain(record);
  }

  async hasSchedulingConflict(params: CheckScheduleConflictParams): Promise<boolean> {
    return this.checkConflictWithClient(this.prisma, params);
  }

  async getSeatInventorySummary(showId: string): Promise<ShowSeatInventorySummary> {
    const aggregate = await this.prisma.showSeat.aggregate({
      where: { showId },
      _count: { id: true },
      _min: { price: true },
    });

    return {
      totalSeats: aggregate._count.id,
      minPrice: aggregate._min.price ?? 0,
    };
  }

  async countActiveBookings(showId: string): Promise<number> {
    return this.prisma.booking.count({
      where: {
        showId,
        status: {
          in: [BookingStatus.PENDING_PAYMENT, BookingStatus.CONFIRMED],
        },
      },
    });
  }

  async countBookings(showId: string): Promise<number> {
    return this.prisma.booking.count({
      where: { showId },
    });
  }

  async create(data: CreateShowData): Promise<Show> {
    return this.prisma.$transaction(async (tx) => {
      await this.lockScreenSchedule(tx, data.screenId);

      const hasConflict = await this.checkConflictWithClient(tx, {
        screenId: data.screenId,
        startTime: data.startTime,
        endTime: data.endTime,
        cleaningBufferMinutes:
          data.cleaningBufferMinutes ?? DEFAULT_CLEANING_BUFFER_MINUTES,
      });

      if (hasConflict) {
        throw new ConflictError(
          'Screen already has an overlapping show (including cleaning buffer) in the requested time window',
          { field: 'startTime' },
        );
      }

      const createdShow = await tx.show.create({
        data: {
          movieId: data.movieId,
          screenId: data.screenId,
          cinemaFormatId: data.cinemaFormatId,
          startTime: data.startTime,
          endTime: data.endTime,
          basePrice: data.basePrice,
          status: data.status as PrismaShowStatus,
        },
      });

      if (data.seats.length > 0) {
        await tx.showSeat.createMany({
          data: data.seats.map((seat) => ({
            showId: createdShow.id,
            seatId: seat.seatId,
            price: seat.price,
            priceAdjustment: seat.priceAdjustment,
          })),
        });
      }

      return ShowMapper.toDomain(createdShow);
    });
  }

  async publish(show: Show, cleaningBufferMinutes: number): Promise<Show> {
    return this.prisma.$transaction(async (tx) => {
      await this.lockScreenSchedule(tx, show.screenId);

      const hasConflict = await this.checkConflictWithClient(tx, {
        screenId: show.screenId,
        startTime: show.startTime,
        endTime: show.endTime,
        cleaningBufferMinutes,
        excludeShowId: show.id,
      });

      if (hasConflict) {
        throw new ConflictError(
          'Cannot publish show due to a scheduling conflict on this screen',
          { field: 'startTime' },
        );
      }

      const updated = await tx.show.update({
        where: { id: show.id },
        data: {
          status: PrismaShowStatus.PUBLISHED,
        },
      });

      return ShowMapper.toDomain(updated);
    });
  }

  async cancel(show: Show): Promise<Show> {
    return this.prisma.$transaction(async (tx) => {
      await this.lockScreenSchedule(tx, show.screenId);

      const activeBookingsCount = await tx.booking.count({
        where: {
          showId: show.id,
          status: {
            in: [BookingStatus.PENDING_PAYMENT, BookingStatus.CONFIRMED],
          },
        },
      });

      if (activeBookingsCount > 0) {
        throw new ConflictError(
          'Cannot cancel a show that has confirmed or pending bookings',
        );
      }

      const updated = await tx.show.update({
        where: { id: show.id },
        data: {
          status: PrismaShowStatus.CANCELLED,
        },
      });

      return ShowMapper.toDomain(updated);
    });
  }

  async update(data: UpdateShowData): Promise<Show> {
    return this.prisma.$transaction(async (tx) => {
      await this.lockScreenSchedule(tx, data.screenId);

      const hasConflict = await this.checkConflictWithClient(tx, {
        screenId: data.screenId,
        startTime: data.startTime,
        endTime: data.endTime,
        cleaningBufferMinutes:
          data.cleaningBufferMinutes ?? DEFAULT_CLEANING_BUFFER_MINUTES,
        excludeShowId: data.showId,
      });

      if (hasConflict) {
        throw new ConflictError(
          'Screen already has an overlapping show (including cleaning buffer) in the requested time window',
          { field: 'startTime' },
        );
      }

      if (data.seats !== undefined) {
        const existingBookings = await tx.booking.count({
          where: { showId: data.showId },
        });

        if (existingBookings > 0) {
          throw new ConflictError(
            'Cannot modify seat inventory or pricing for a show that already has bookings',
          );
        }

        await tx.showSeat.deleteMany({
          where: { showId: data.showId },
        });

        if (data.seats.length > 0) {
          await tx.showSeat.createMany({
            data: data.seats.map((seat) => ({
              showId: data.showId,
              seatId: seat.seatId,
              price: seat.price,
              priceAdjustment: seat.priceAdjustment,
            })),
          });
        }
      }

      const updated = await tx.show.update({
        where: { id: data.showId },
        data: {
          movieId: data.movieId,
          cinemaFormatId: data.cinemaFormatId,
          startTime: data.startTime,
          endTime: data.endTime,
          basePrice: data.basePrice,
        },
      });

      return ShowMapper.toDomain(updated);
    });
  }
}


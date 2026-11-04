import { Prisma, PrismaClient } from '@prisma/client';
import { Seat } from '../../../domain/entities/Seat';
import type { ISeatRepository } from '../../../domain/repositories/ISeatRepository';
import type { CreateSeatProps } from '../../../domain/types/CreateSeatProps';
import { SeatMapper } from '../mappers/SeatMapper';
import type { SeatType } from '../../../domain/enums/SeatType';
export class PrismaSeatRepository implements ISeatRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Seat | null> {
    const seat = await this.prisma.seat.findUnique({
      where: { id },
    });

    return seat ? SeatMapper.toDomain(seat) : null;
  }

  async findByLabel(screenId: string, label: string): Promise<Seat | null> {
    const seat = await this.prisma.seat.findUnique({
      where: {
        screenId_label: { screenId, label },
      },
    });

    return seat ? SeatMapper.toDomain(seat) : null;
  }

  async create(data: CreateSeatProps): Promise<Seat> {
    return this.prisma.$transaction(async (tx) => {
      await this.lockScreenSeats(tx, data.screenId);

      const createdSeat = await tx.seat.create({
        data: {
          screenId: data.screenId,
          rowLabel: data.rowLabel,
          seatNumber: data.seatNumber,
          label: data.label,
          x: data.x,
          y: data.y,
          rotation: data.rotation,
          type: data.type,
        },
      });

      return SeatMapper.toDomain(createdSeat);
    });
  }

  async countByScreenId(screenId: string): Promise<number> {
    return this.prisma.seat.count({
      where: { screenId },
    });
  }

  async createManyForEmptyScreen(
    screenId: string,
    seats: CreateSeatProps[],
  ): Promise<Seat[] | null> {
    return this.prisma.$transaction(async (tx) => {
      await this.lockScreenSeats(tx, screenId);

      const existingSeatCount = await tx.seat.count({
        where: { screenId },
      });

      if (existingSeatCount > 0) {
        return null;
      }

      await tx.seat.createMany({
        data: seats.map((seat) => ({
          screenId,
          rowLabel: seat.rowLabel,
          seatNumber: seat.seatNumber,
          label: seat.label,
          x: seat.x,
          y: seat.y,
          rotation: seat.rotation,
          type: seat.type,
        })),
      });

      const createdSeats = await tx.seat.findMany({
        where: { screenId },
        orderBy: [{ rowLabel: 'asc' }, { seatNumber: 'asc' }],
      });

      return createdSeats.map(SeatMapper.toDomain);
    });
  }

  private async lockScreenSeats(tx: Prisma.TransactionClient, screenId: string): Promise<void> {
    await tx.$queryRaw`
      SELECT pg_advisory_xact_lock(
        hashtext('movira_seats'),
        hashtext(${screenId})
      )
    `;
  }

  async findAllSeatByScreenId(screenId: string): Promise<Seat[]> {
    const seats = await this.prisma.seat.findMany({
      where: { screenId },
      orderBy: [
        { rowLabel: "asc" },
        { seatNumber: "asc" },
      ]
    });

    return seats.map(SeatMapper.toDomain)
  }


async updateManySeatPositions(
  screenId: string,
  seats: {
    seatId: string;
    x: number;
    y: number;
    rotation: number;
  }[],
): Promise<Seat[] | null> {
  return this.prisma.$transaction(async (tx) => {
    await this.lockScreenSeats(tx, screenId);

    const seatIds = seats.map((seat) => seat.seatId);

    const existingSeats = await tx.seat.findMany({
      where: {
        screenId,
        id: { in: seatIds },
      },
      select: { id: true },
    });

if (existingSeats.length !== seatIds.length) {
  return null;
}

    await Promise.all(
      seats.map((seat) =>
        tx.seat.update({
          where: { id: seat.seatId },
          data: {
            x: seat.x,
            y: seat.y,
            rotation: seat.rotation,
          },
        }),
      ),
    );

    const updatedSeats = await tx.seat.findMany({
      where: {
        screenId,
        id: { in: seatIds },
      },
      orderBy: [
        { rowLabel: 'asc' },
        { seatNumber: 'asc' },
      ],
    });

    return updatedSeats.map(SeatMapper.toDomain);
  });
}

  async updateSeatDetails(
  seatId: string,
  data: {
    type?: SeatType;
    isActive?: boolean;
  },
): Promise<Seat | null> {
  return this.prisma.$transaction(async (tx) => {
    const existingSeat = await tx.seat.findUnique({
      where: { id: seatId },
      select: { screenId: true },
    });

    if (!existingSeat) {
      return null;
    }

    await this.lockScreenSeats(tx, existingSeat.screenId);

    const updatedSeat = await tx.seat.update({
      where: { id: seatId },
      data: {
        ...(data.type !== undefined && { type: data.type }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });

    return SeatMapper.toDomain(updatedSeat);
  });
}

}

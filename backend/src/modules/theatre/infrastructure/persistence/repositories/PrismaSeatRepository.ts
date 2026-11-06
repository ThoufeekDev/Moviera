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
    return this.prisma.$transaction(
      async (tx) => {
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
      },
      {
        maxWait: 5000,
        timeout: 10000,
      },
    );
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
    return this.prisma.$transaction(
      async (tx) => {
        await this.lockScreenSeats(tx, screenId);

        const existingSeatCount = await tx.seat.count({
          where: { screenId },
        });

        if (existingSeatCount > 0) {
          return null;
        }

        const createdSeats = await tx.seat.createManyAndReturn({
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

        createdSeats.sort((a, b) => {
          const rowCompare = a.rowLabel.localeCompare(b.rowLabel);
          if (rowCompare !== 0) return rowCompare;
          return a.seatNumber - b.seatNumber;
        });

        return createdSeats.map(SeatMapper.toDomain);
      },
      {
        maxWait: 10000,
        timeout: 30000,
      },
    );
  }

  private async lockScreenSeats(tx: Prisma.TransactionClient, screenId: string): Promise<void> {
    await tx.$executeRaw`
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
  if (seats.length === 0) {
    return [];
  }

  return this.prisma.$transaction(
    async (tx) => {
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

      const values = seats.map(
        (seat) =>
          Prisma.sql`(${seat.seatId}, ${seat.x}::double precision, ${seat.y}::double precision, ${seat.rotation}::double precision)`,
      );

      await tx.$executeRaw`
        UPDATE "Seat" AS s
        SET
          x = v.x,
          y = v.y,
          rotation = v.rotation,
          "updatedAt" = NOW()
        FROM (VALUES ${Prisma.join(values)}) AS v(id, x, y, rotation)
        WHERE s.id = v.id AND s."screenId" = ${screenId}
      `;

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
    },
    {
      maxWait: 10000,
      timeout: 30000,
    },
  );
}

  async updateSeatDetails(
  seatId: string,
  data: {
    type?: SeatType;
    isActive?: boolean;
  },
): Promise<Seat | null> {
  return this.prisma.$transaction(
    async (tx) => {
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
    },
    {
      maxWait: 5000,
      timeout: 10000,
    },
  );
}

  async updateManySeatProperties(
    screenId: string,
    seats: {
      seatId: string;
      type?: SeatType;
      isActive?: boolean;
    }[],
  ): Promise<Seat[] | null> {
    if (seats.length === 0) {
      return [];
    }

    return this.prisma.$transaction(
      async (tx) => {
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

        const values = seats.map((seat) => {
          const typeSql =
            seat.type !== undefined
              ? Prisma.sql`${seat.type}::"SeatType"`
              : Prisma.sql`NULL::"SeatType"`;
          const activeSql =
            seat.isActive !== undefined
              ? Prisma.sql`${seat.isActive}::boolean`
              : Prisma.sql`NULL::boolean`;

          return Prisma.sql`(${seat.seatId}, ${typeSql}, ${activeSql})`;
        });

        await tx.$executeRaw`
          UPDATE "Seat" AS s
          SET
            type = COALESCE(v.type, s.type),
            "isActive" = COALESCE(v.is_active, s."isActive"),
            "updatedAt" = NOW()
          FROM (VALUES ${Prisma.join(values)}) AS v(id, type, is_active)
          WHERE s.id = v.id AND s."screenId" = ${screenId}
        `;

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
      },
      {
        maxWait: 10000,
        timeout: 30000,
      },
    );
  }

}

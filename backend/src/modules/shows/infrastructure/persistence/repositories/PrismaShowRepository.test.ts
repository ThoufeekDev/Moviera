import type { PrismaClient } from '@prisma/client';
import { describe, expect, it, vi } from 'vitest';
import { ConflictError } from '../../../../../shared/errors/ConflictError';
import { Show } from '../../../domain/entities/Show';
import { ShowStatus } from '../../../domain/enums/ShowStatus';
import { PrismaShowRepository } from './PrismaShowRepository';

describe('PrismaShowRepository', () => {
  it('acquires per-screen advisory lock, checks conflicts with cleaning buffer, and atomically creates Show + ShowSeats', async () => {
    const tx = {
      $executeRaw: vi.fn().mockResolvedValue(1),
      show: {
        findFirst: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({
          id: 'show-1',
          movieId: 'movie-1',
          screenId: 'screen-1',
          cinemaFormatId: 'format-1',
          startTime: new Date('2026-12-10T10:00:00.000Z'),
          endTime: new Date('2026-12-10T12:00:00.000Z'),
          basePrice: 20000,
          status: 'DRAFT',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      },
      showSeat: {
        createMany: vi.fn().mockResolvedValue({ count: 2 }),
      },
    };

    const prisma = {
      $transaction: vi.fn(async (cb: (client: typeof tx) => unknown) => cb(tx)),
    } as unknown as PrismaClient;

    const repo = new PrismaShowRepository(prisma);

    const created = await repo.create({
      movieId: 'movie-1',
      screenId: 'screen-1',
      cinemaFormatId: 'format-1',
      startTime: new Date('2026-12-10T10:00:00.000Z'),
      endTime: new Date('2026-12-10T12:00:00.000Z'),
      basePrice: 20000,
      status: ShowStatus.DRAFT,
      cleaningBufferMinutes: 15,
      seats: [
        { seatId: 'seat-1', price: 20000, priceAdjustment: 0 },
        { seatId: 'seat-2', price: 25000, priceAdjustment: 5000 },
      ],
    });

    expect(tx.$executeRaw).toHaveBeenCalledTimes(1);
    expect(tx.show.findFirst).toHaveBeenCalledWith({
      where: {
        screenId: 'screen-1',
        status: { in: ['DRAFT', 'PUBLISHED'] },
        startTime: { lt: new Date('2026-12-10T12:15:00.000Z') },
        endTime: { gt: new Date('2026-12-10T09:45:00.000Z') },
      },
      select: { id: true },
    });
    expect(tx.showSeat.createMany).toHaveBeenCalledWith({
      data: [
        { showId: 'show-1', seatId: 'seat-1', price: 20000, priceAdjustment: 0 },
        { showId: 'show-1', seatId: 'seat-2', price: 25000, priceAdjustment: 5000 },
      ],
    });
    expect(created.id).toBe('show-1');
  });

  it('serializes concurrent overlapping show creations on the same screen so only one succeeds and the second fails with ConflictError', async () => {
    const persistedShows: Array<{
      id: string;
      screenId: string;
      status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
      startTime: Date;
      endTime: Date;
    }> = [];

    // Simulate serialized transaction execution via per-screen advisory lock
    let mutex = Promise.resolve();

    const prisma = {
      $transaction: vi.fn(async (cb: (client: unknown) => Promise<unknown>) => {
        const prev = mutex;
        let release!: () => void;
        mutex = new Promise<void>((resolve) => {
          release = resolve;
        });
        await prev;

        try {
          const tx = {
            $executeRaw: vi.fn().mockResolvedValue(1),
            show: {
              findFirst: vi.fn(
                async ({
                  where,
                }: {
                  where: {
                    screenId: string;
                    status: { in: string[] };
                    startTime: { lt: Date };
                    endTime: { gt: Date };
                  };
                }) => {
                  const found = persistedShows.find(
                    (s) =>
                      s.screenId === where.screenId &&
                      where.status.in.includes(s.status) &&
                      s.startTime.getTime() < where.startTime.lt.getTime() &&
                      s.endTime.getTime() > where.endTime.gt.getTime(),
                  );
                  return found ? { id: found.id } : null;
                },
              ),
              create: vi.fn(async ({ data }: { data: Record<string, unknown> }) => {
                const record = {
                  id: `show-${persistedShows.length + 1}`,
                  movieId: data.movieId as string,
                  screenId: data.screenId as string,
                  cinemaFormatId: data.cinemaFormatId as string,
                  startTime: data.startTime as Date,
                  endTime: data.endTime as Date,
                  basePrice: data.basePrice as number,
                  status: 'DRAFT' as const,
                  isActive: true,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                };
                persistedShows.push(record);
                return record;
              }),
            },
            showSeat: {
              createMany: vi.fn().mockResolvedValue({ count: 1 }),
            },
          };

          return await cb(tx);
        } finally {
          release();
        }
      }),
    } as unknown as PrismaClient;

    const repo = new PrismaShowRepository(prisma);

    const payload1 = {
      movieId: 'movie-1',
      screenId: 'screen-1',
      cinemaFormatId: 'format-1',
      startTime: new Date('2026-12-10T10:00:00.000Z'),
      endTime: new Date('2026-12-10T12:00:00.000Z'),
      basePrice: 20000,
      status: ShowStatus.DRAFT,
      cleaningBufferMinutes: 15,
      seats: [{ seatId: 'seat-1', price: 20000, priceAdjustment: 0 }],
    };

    // Second request starts 10 minutes after first show ends (within 15-min cleaning buffer!)
    const payload2 = {
      ...payload1,
      startTime: new Date('2026-12-10T12:10:00.000Z'),
      endTime: new Date('2026-12-10T14:10:00.000Z'),
    };

    const results = await Promise.allSettled([
      repo.create(payload1),
      repo.create(payload2),
    ]);

    const fulfilled = results.filter((r) => r.status === 'fulfilled');
    const rejected = results.filter(
      (r): r is PromiseRejectedResult => r.status === 'rejected',
    );

    expect(fulfilled).toHaveLength(1);
    expect(rejected).toHaveLength(1);
    expect(rejected[0].reason).toBeInstanceOf(ConflictError);
    expect(persistedShows).toHaveLength(1);
  });

  it('allows scheduling a show immediately after the cleaning buffer or over a CANCELLED show', async () => {
    const persistedShows = [
      {
        id: 'cancelled-show',
        screenId: 'screen-1',
        status: 'CANCELLED',
        startTime: new Date('2026-12-10T12:15:00.000Z'),
        endTime: new Date('2026-12-10T14:15:00.000Z'),
      },
      {
        id: 'existing-show',
        screenId: 'screen-1',
        status: 'PUBLISHED',
        startTime: new Date('2026-12-10T10:00:00.000Z'),
        endTime: new Date('2026-12-10T12:00:00.000Z'),
      },
    ];

    const prisma = {
      show: {
        findFirst: vi.fn(
          async ({
            where,
          }: {
            where: {
              screenId: string;
              status: { in: string[] };
              startTime: { lt: Date };
              endTime: { gt: Date };
            };
          }) => {
            const match = persistedShows.find(
              (s) =>
                s.screenId === where.screenId &&
                where.status.in.includes(s.status) &&
                s.startTime.getTime() < where.startTime.lt.getTime() &&
                s.endTime.getTime() > where.endTime.gt.getTime(),
            );
            return match ? { id: match.id } : null;
          },
        ),
      },
    } as unknown as PrismaClient;

    const repo = new PrismaShowRepository(prisma);

    // Starts at 12:15 (exact 15m buffer after 12:00) and overlaps with a CANCELLED show
    const conflict = await repo.hasSchedulingConflict({
      screenId: 'screen-1',
      startTime: new Date('2026-12-10T12:15:00.000Z'),
      endTime: new Date('2026-12-10T14:15:00.000Z'),
      cleaningBufferMinutes: 15,
    });

    expect(conflict).toBe(false);
  });

  it('prevents cancelling a show inside transaction if a booking was concurrently created', async () => {
    const tx = {
      $executeRaw: vi.fn().mockResolvedValue(1),
      booking: {
        count: vi.fn().mockResolvedValue(1),
      },
      show: {
        update: vi.fn(),
      },
    };

    const prisma = {
      $transaction: vi.fn(async (cb: (client: typeof tx) => unknown) => cb(tx)),
    } as unknown as PrismaClient;

    const repo = new PrismaShowRepository(prisma);
    const show = Show.reconstitute({
      id: 'show-1',
      movieId: 'movie-1',
      screenId: 'screen-1',
      cinemaFormatId: 'format-1',
      startTime: new Date('2026-12-10T10:00:00.000Z'),
      endTime: new Date('2026-12-10T12:00:00.000Z'),
      basePrice: 20000,
      status: ShowStatus.CANCELLED,
    });

    await expect(repo.cancel(show)).rejects.toThrow(ConflictError);
    expect(tx.show.update).not.toHaveBeenCalled();
  });
});


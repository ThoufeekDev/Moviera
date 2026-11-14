import type { PrismaClient } from '@prisma/client';
import { describe, expect, it, vi } from 'vitest';
import { SeatType } from '../../../../theatre';
import { ShowStatus } from '../../../domain/enums/ShowStatus';
import { PrismaShowQueryService } from './PrismaShowQueryService';

describe('PrismaShowQueryService', () => {
  it('lists shows with pagination, theatre admin scoping, and batch seat inventory counts', async () => {
    const prisma = {
      show: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: 'show-1',
            status: 'PUBLISHED',
            startTime: new Date('2026-12-10T10:00:00.000Z'),
            endTime: new Date('2026-12-10T12:30:00.000Z'),
            basePrice: 20000,
            createdAt: new Date('2026-12-01T00:00:00.000Z'),
            updatedAt: new Date('2026-12-01T00:00:00.000Z'),
            movie: {
              id: 'movie-1',
              title: 'Dune: Part Two',
              posterUrl: 'https://example.com/dune.jpg',
              duration: 150,
              certification: 'UA',
              languages: [{ language: { name: 'English' } }],
            },
            screen: {
              id: 'screen-1',
              name: 'Audi 1',
              _count: { seats: 100 },
              theatre: {
                id: 'theatre-1',
                name: 'PVR Lulu',
                city: { name: 'Kochi' },
              },
            },
            cinemaFormat: {
              id: 'format-imax',
              name: 'IMAX 2D',
              slug: 'imax-2d',
            },
          },
        ]),
        count: vi.fn().mockResolvedValue(1),
      },
      showSeat: {
        groupBy: vi.fn().mockResolvedValue([
          { showId: 'show-1', status: 'AVAILABLE', _count: { id: 85 } },
          { showId: 'show-1', status: 'BOOKED', _count: { id: 15 } },
        ]),
      },
    } as unknown as PrismaClient;

    const queryService = new PrismaShowQueryService(prisma);
    const result = await queryService.listShows({
      page: 1,
      limit: 20,
      theatreAdminUserId: 'admin-1',
      status: ShowStatus.PUBLISHED,
    });

    expect(result.pagination).toEqual({
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
    });
    expect(result.items[0].seatSummary).toEqual({
      totalSeats: 100,
      availableSeats: 85,
      bookedSeats: 15,
    });
    expect(result.items[0].movie.languages).toEqual(['English']);
  });

  it('aggregates tier pricing and seat inventory summary in findShowDetailById', async () => {
    const prisma = {
      show: {
        findUnique: vi.fn().mockResolvedValue({
          id: 'show-1',
          status: 'DRAFT',
          startTime: new Date('2026-12-10T10:00:00.000Z'),
          endTime: new Date('2026-12-10T12:30:00.000Z'),
          basePrice: 20000,
          createdAt: new Date('2026-12-01T00:00:00.000Z'),
          updatedAt: new Date('2026-12-01T00:00:00.000Z'),
          movie: {
            id: 'movie-1',
            title: 'Dune: Part Two',
            posterUrl: null,
            duration: 150,
            certification: 'UA',
            isActive: true,
            languages: [{ language: { name: 'English' } }],
          },
          screen: {
            id: 'screen-1',
            name: 'Audi 1',
            isActive: true,
            _count: { seats: 3 },
            theatre: {
              id: 'theatre-1',
              name: 'PVR Lulu',
              cleaningBufferMinutes: 15,
              isActive: true,
              city: { name: 'Kochi' },
            },
          },
          cinemaFormat: {
            id: 'format-imax',
            name: 'IMAX 2D',
            slug: 'imax-2d',
          },
          showSeats: [
            {
              price: 20000,
              priceAdjustment: 0,
              status: 'AVAILABLE',
              seat: { type: SeatType.REGULAR },
            },
            {
              price: 25000,
              priceAdjustment: 5000,
              status: 'AVAILABLE',
              seat: { type: SeatType.PREMIUM },
            },
            {
              price: 25000,
              priceAdjustment: 5000,
              status: 'BOOKED',
              seat: { type: SeatType.PREMIUM },
            },
          ],
        }),
      },
    } as unknown as PrismaClient;

    const queryService = new PrismaShowQueryService(prisma);
    const detail = await queryService.findShowDetailById('show-1');

    expect(detail).not.toBeNull();
    expect(detail?.pricing.minPrice).toBe(20000);
    expect(detail?.pricing.maxPrice).toBe(25000);
    expect(detail?.seatInventorySummary).toEqual({
      totalSeats: 3,
      availableSeats: 2,
      bookedSeats: 1,
    });
    expect(detail?.pricing.tiers).toEqual([
      {
        seatType: SeatType.REGULAR,
        priceAdjustment: 0,
        finalPrice: 20000,
        totalSeats: 1,
        availableSeats: 1,
        bookedSeats: 0,
      },
      {
        seatType: SeatType.PREMIUM,
        priceAdjustment: 5000,
        finalPrice: 25000,
        totalSeats: 2,
        availableSeats: 1,
        bookedSeats: 1,
      },
    ]);
  });
});


import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { PrismaClient } from '@prisma/client';
import { PrismaScreenQueryService } from './PrismaScreenQueryService';

describe('PrismaScreenQueryService.listByTheatre', () => {
  let prismaMock: {
    screen: { findMany: ReturnType<typeof vi.fn>; count: ReturnType<typeof vi.fn> };
    seat: { groupBy: ReturnType<typeof vi.fn> };
  };
  let service: PrismaScreenQueryService;

  const dbScreen = {
    id: 'screen-1',
    theatreId: 'theatre-1',
    name: 'Audi 1',
    slug: 'audi-1',
    isActive: true,
    _count: { seats: 120, shows: 4 },
  };

  beforeEach(() => {
    prismaMock = {
      screen: {
        findMany: vi.fn().mockResolvedValue([dbScreen]),
        count: vi.fn().mockResolvedValue(1),
      },
      seat: {
        groupBy: vi.fn().mockResolvedValue([
          { screenId: 'screen-1', rowLabel: 'A' },
          { screenId: 'screen-1', rowLabel: 'B' },
        ]),
      },
    };
    service = new PrismaScreenQueryService(prismaMock as unknown as PrismaClient);
  });

  it('scopes to the theatre with default pagination of 20, deterministic order and mapped counts', async () => {
    const result = await service.listByTheatre('theatre-1');

    const expectedWhere = { AND: [{ theatreId: 'theatre-1' }] };
    expect(prismaMock.screen.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expectedWhere,
        skip: 0,
        take: 20,
        orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      }),
    );
    expect(prismaMock.screen.count).toHaveBeenCalledWith({ where: expectedWhere });
    expect(result).toEqual({
      items: [
        {
          id: 'screen-1',
          theatreId: 'theatre-1',
          name: 'Audi 1',
          slug: 'audi-1',
          isActive: true,
          totalSeats: 120,
          totalRows: 2,
          totalShows: 4,
          seatConfigurationStatus: 'CONFIGURED',
        },
      ],
      pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
    });
  });

  it('combines a trimmed case-insensitive search on name and slug with the ACTIVE status', async () => {
    await service.listByTheatre('theatre-1', { search: '  audi ', status: 'ACTIVE' });

    expect(prismaMock.screen.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          AND: [
            { theatreId: 'theatre-1' },
            {
              OR: [
                { name: { contains: 'audi', mode: 'insensitive' } },
                { slug: { contains: 'audi', mode: 'insensitive' } },
              ],
            },
            { isActive: true },
          ],
        },
      }),
    );
  });

  it('filters inactive screens and ignores a blank search', async () => {
    await service.listByTheatre('theatre-1', { search: '   ', status: 'INACTIVE' });

    expect(prismaMock.screen.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { AND: [{ theatreId: 'theatre-1' }, { isActive: false }] },
      }),
    );
  });

  it('clamps page and limit', async () => {
    prismaMock.screen.count.mockResolvedValue(250);

    const result = await service.listByTheatre('theatre-1', { page: 0, limit: 500 });

    expect(prismaMock.screen.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 0, take: 100 }),
    );
    expect(result.pagination).toEqual({ page: 1, limit: 100, total: 250, totalPages: 3 });
  });

  it('computes skip from the requested page', async () => {
    await service.listByTheatre('theatre-1', { page: 3, limit: 20 });

    expect(prismaMock.screen.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 40, take: 20 }),
    );
  });
});

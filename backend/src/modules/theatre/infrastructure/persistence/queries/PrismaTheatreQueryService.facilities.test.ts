import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PrismaTheatreQueryService } from './PrismaTheatreQueryService';
import { PrismaClient } from '@prisma/client';

describe('PrismaTheatreQueryService - Facilities queries', () => {
  let prismaMock: any;
  let service: PrismaTheatreQueryService;

  beforeEach(() => {
    prismaMock = {
      theatreFacility: {
        findMany: vi.fn(),
        count: vi.fn(),
      },
    };
    service = new PrismaTheatreQueryService(prismaMock as unknown as PrismaClient);
  });

  const sampleDbFacility = {
    id: 'fac-1',
    name: 'Parking',
    slug: 'parking',
    description: 'Secure vehicle parking',
    iconKey: 'parking',
    isActive: true,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
    _count: {
      assignments: 5,
    },
  };

  it('should fetch facilities with default pagination, deterministic sort, and assignedTheatreCount', async () => {
    prismaMock.theatreFacility.findMany.mockResolvedValue([sampleDbFacility]);
    prismaMock.theatreFacility.count.mockResolvedValue(1);

    const result = await service.listFacilities();

    expect(prismaMock.theatreFacility.findMany).toHaveBeenCalledWith({
      where: {},
      take: 10,
      skip: 0,
      select: expect.objectContaining({
        id: true,
        name: true,
        slug: true,
        description: true,
        iconKey: true,
        isActive: true,
        _count: {
          select: {
            assignments: true,
          },
        },
      }),
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
    });

    expect(result.items).toHaveLength(1);
    expect(result.items[0].assignedTheatreCount).toBe(5);
    expect(result.pagination.total).toBe(1);
    expect(result.pagination.page).toBe(1);
  });

  it('should search case-insensitively across name and description', async () => {
    prismaMock.theatreFacility.findMany.mockResolvedValue([]);
    prismaMock.theatreFacility.count.mockResolvedValue(0);

    await service.listFacilities({ search: 'wheelchair' });

    expect(prismaMock.theatreFacility.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          AND: [
            {
              OR: [
                { name: { contains: 'wheelchair', mode: 'insensitive' } },
                { description: { contains: 'wheelchair', mode: 'insensitive' } },
              ],
            },
          ],
        },
      }),
    );
  });

  it('should filter by ACTIVE and INACTIVE status combined with search', async () => {
    prismaMock.theatreFacility.findMany.mockResolvedValue([]);
    prismaMock.theatreFacility.count.mockResolvedValue(0);

    await service.listFacilities({
      search: 'lounge',
      status: 'ACTIVE',
    });

    expect(prismaMock.theatreFacility.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          AND: [
            {
              OR: [
                { name: { contains: 'lounge', mode: 'insensitive' } },
                { description: { contains: 'lounge', mode: 'insensitive' } },
              ],
            },
            { isActive: true },
          ],
        },
      }),
    );

    await service.listFacilities({ status: 'INACTIVE' });
    expect(prismaMock.theatreFacility.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          AND: [{ isActive: false }],
        },
      }),
    );
  });

  it('should sanitize negative or zero pages and limits correctly', async () => {
    prismaMock.theatreFacility.findMany.mockResolvedValue([]);
    prismaMock.theatreFacility.count.mockResolvedValue(0);

    await service.listFacilities({ page: -5, limit: 500 });

    expect(prismaMock.theatreFacility.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 100, // clamped to max 100
        skip: 0, // page 1 -> skip 0
      }),
    );
  });

  it('should list only active facilities for dropdowns via listActiveFacilities', async () => {
    prismaMock.theatreFacility.findMany.mockResolvedValue([
      { id: 'f-1', name: 'Parking', slug: 'parking', iconKey: 'parking' },
    ]);

    const activeList = await service.listActiveFacilities();

    expect(prismaMock.theatreFacility.findMany).toHaveBeenCalledWith({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        iconKey: true,
      },
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
    });
    expect(activeList).toHaveLength(1);
    expect(activeList[0].name).toBe('Parking');
  });
});

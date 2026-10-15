import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PrismaTheatreQueryService } from './PrismaTheatreQueryService';
import { PrismaClient } from '@prisma/client';

describe('PrismaTheatreQueryService - ListAllTheatres', () => {
  let prismaMock: any;
  let service: PrismaTheatreQueryService;

  beforeEach(() => {
    prismaMock = {
      theatre: {
        findMany: vi.fn(),
        count: vi.fn(),
      },
    };
    service = new PrismaTheatreQueryService(prismaMock as unknown as PrismaClient);
  });

  const sampleDbTheatre = {
    id: 'th-1',
    name: 'PVR Forum Mall',
    slug: 'pvr-forum-mall',
    email: 'contact@pvr.com',
    phone: '9876543210',
    logoUrl: 'https://example.com/logo.jpg',
    address: 'Koramangala, Bangalore',
    licenseNumber: 'LIC-KA-2024-001',
    isActive: true,
    createdAt: new Date('2026-01-15T10:00:00Z'),
    updatedAt: new Date('2026-01-15T10:00:00Z'),
    city: {
      id: 'city-1',
      name: 'Bangalore',
      state: 'Karnataka',
    },
    _count: {
      screens: 5,
    },
  };

  it('should fetch theatres with default pagination, deterministic sort, and real screen count', async () => {
    prismaMock.theatre.findMany.mockResolvedValue([sampleDbTheatre]);
    prismaMock.theatre.count.mockResolvedValue(1);

    const result = await service.ListAllTheatres();

    expect(prismaMock.theatre.findMany).toHaveBeenCalledWith({
      where: {},
      take: 20,
      skip: 0,
      select: expect.objectContaining({
        id: true,
        name: true,
        email: true,
        logoUrl: true,
        licenseNumber: true,
        isActive: true,
        _count: {
          select: { screens: true },
        },
      }),
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
    });

    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toEqual({
      id: 'th-1',
      name: 'PVR Forum Mall',
      slug: 'pvr-forum-mall',
      email: 'contact@pvr.com',
      phone: '9876543210',
      logoUrl: 'https://example.com/logo.jpg',
      address: 'Koramangala, Bangalore',
      licenseNumber: 'LIC-KA-2024-001',
      isActive: true,
      totalScreens: 5,
      city: {
        id: 'city-1',
        name: 'Bangalore',
        state: 'Karnataka',
      },
      createdAt: sampleDbTheatre.createdAt,
      updatedAt: sampleDbTheatre.updatedAt,
    });
    expect(result.pagination).toEqual({
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
    });
  });

  it('should apply case-insensitive partial match search across name, email, and licenseNumber', async () => {
    prismaMock.theatre.findMany.mockResolvedValue([sampleDbTheatre]);
    prismaMock.theatre.count.mockResolvedValue(1);

    await service.ListAllTheatres({ search: '  forum  ' });

    expect(prismaMock.theatre.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          AND: [
            {
              OR: [
                { name: { contains: 'forum', mode: 'insensitive' } },
                { email: { contains: 'forum', mode: 'insensitive' } },
                { licenseNumber: { contains: 'forum', mode: 'insensitive' } },
              ],
            },
          ],
        },
      }),
    );
  });

  it('should filter by ACTIVE status correctly', async () => {
    prismaMock.theatre.findMany.mockResolvedValue([sampleDbTheatre]);
    prismaMock.theatre.count.mockResolvedValue(1);

    await service.ListAllTheatres({ status: 'ACTIVE' });

    expect(prismaMock.theatre.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          AND: [{ isActive: true }],
        },
      }),
    );
  });

  it('should filter by INACTIVE status correctly', async () => {
    prismaMock.theatre.findMany.mockResolvedValue([]);
    prismaMock.theatre.count.mockResolvedValue(0);

    await service.ListAllTheatres({ status: 'INACTIVE' });

    expect(prismaMock.theatre.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          AND: [{ isActive: false }],
        },
      }),
    );
  });

  it('should combine search term and status filter with AND', async () => {
    prismaMock.theatre.findMany.mockResolvedValue([sampleDbTheatre]);
    prismaMock.theatre.count.mockResolvedValue(1);

    await service.ListAllTheatres({ search: 'contact@pvr.com', status: 'ACTIVE' });

    expect(prismaMock.theatre.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          AND: [
            {
              OR: [
                { name: { contains: 'contact@pvr.com', mode: 'insensitive' } },
                { email: { contains: 'contact@pvr.com', mode: 'insensitive' } },
                { licenseNumber: { contains: 'contact@pvr.com', mode: 'insensitive' } },
              ],
            },
            { isActive: true },
          ],
        },
      }),
    );
  });

  it('should clamp invalid page and limit values', async () => {
    prismaMock.theatre.findMany.mockResolvedValue([]);
    prismaMock.theatre.count.mockResolvedValue(0);

    // Negative page and excessive limit
    await service.ListAllTheatres({ page: -5, limit: 250 });

    expect(prismaMock.theatre.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 100, // Clamped to 100 max
      }),
    );
  });

  it('should handle pagination math when total exceeds limit', async () => {
    prismaMock.theatre.findMany.mockResolvedValue([sampleDbTheatre]);
    prismaMock.theatre.count.mockResolvedValue(55);

    const result = await service.ListAllTheatres({ page: 2, limit: 20 });

    expect(prismaMock.theatre.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 20,
        take: 20,
      }),
    );
    expect(result.pagination).toEqual({
      page: 2,
      limit: 20,
      total: 55,
      totalPages: 3,
    });
  });

  it('should handle empty results gracefully', async () => {
    prismaMock.theatre.findMany.mockResolvedValue([]);
    prismaMock.theatre.count.mockResolvedValue(0);

    const result = await service.ListAllTheatres({ search: 'nonexistent' });

    expect(result.items).toEqual([]);
    expect(result.pagination).toEqual({
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
    });
  });
});

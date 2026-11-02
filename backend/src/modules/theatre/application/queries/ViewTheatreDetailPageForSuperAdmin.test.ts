import { describe, it, expect, vi } from 'vitest';
import { ViewTheatreDetailPageForSuperAdmin } from './ViewTheatreDetailPageForSuperAdmin';
import { ITheatreQueryService } from '../ports/ITheatreQueryService';
import { BadRequestError } from '../../../../shared/errors/BadRequestError';
import { NotFoundError } from '../../../../shared/errors/NotFoundError';
import { SuperAdminTheatreDetail } from '../read-models/SuperAdminTheatreDetail';

describe('ViewTheatreDetailPageForSuperAdmin', () => {
  const mockDetail: SuperAdminTheatreDetail = {
    id: 'theatre-1',
    name: 'PVR Forum Mall',
    slug: 'pvr-forum-mall',
    address: 'Koramangala, Hosur Road',
    description: 'Premier cinema destination',
    logoUrl: 'https://example.com/logo.jpg',
    email: 'forum@pvr.com',
    phone: '+91 9876543210',
    latitude: 12.9352,
    longitude: 77.6115,
    pincode: '560095',
    landmark: 'Opposite Nexus',
    googlePlaceId: 'place-123',
    isActive: true,
    licenseNumber: 'LIC-12345',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
    createdById: 'user-admin',
    createdByName: 'Admin User',
    city: {
      id: 'city-1',
      name: 'Bengaluru',
      district: 'Bengaluru Urban',
      state: 'Karnataka',
      country: 'India',
    },
    area: {
      id: 'area-1',
      name: 'Koramangala',
    },
    statistics: {
      totalScreens: 3,
      totalSeats: 450,
      todayShows: 12,
      todayBookings: 85,
    },
    screens: [
      {
        id: 'screen-1',
        name: 'Audi 1',
        slug: 'audi-1',
        isActive: true,
        cinemaFormats: [{ id: 'cf-1', name: 'IMAX 3D' }],
        seatingCapacity: 150,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    ],
    facilities: [
      {
        id: 'fac-1',
        name: 'Parking',
        slug: 'parking',
        description: 'Multi-level parking',
        icon: null,
        iconKey: 'parking',
      },
    ],
    assignedAdmins: [
      {
        assignmentId: 'assign-1',
        userId: 'admin-1',
        name: 'John Admin',
        email: 'john@moviera.com',
        phone: '+91 9999988888',
        role: 'OPERATIONS_SUPERVISOR',
        isActive: true,
        assignedAt: '2026-01-01T00:00:00.000Z',
      },
    ],
    activityHistory: [
      {
        id: 'act-1',
        type: 'THEATRE_CREATED',
        title: 'Theatre Registered',
        description: 'Theatre was registered',
        performedBy: 'Admin User',
        timestamp: '2026-01-01T00:00:00.000Z',
      },
    ],
  };

  it('should throw BadRequestError when theatreId is missing or empty', async () => {
    const mockQueryService = {
      getTheatreDetailForSuperAdmin: vi.fn(),
    } as unknown as ITheatreQueryService;

    const useCase = new ViewTheatreDetailPageForSuperAdmin(mockQueryService);

    await expect(useCase.execute('')).rejects.toThrow(BadRequestError);
    await expect(useCase.execute('   ')).rejects.toThrow(BadRequestError);
    expect(mockQueryService.getTheatreDetailForSuperAdmin).not.toHaveBeenCalled();
  });

  it('should throw NotFoundError when theatre is not found', async () => {
    const mockQueryService = {
      getTheatreDetailForSuperAdmin: vi.fn().mockResolvedValue(null),
    } as unknown as ITheatreQueryService;

    const useCase = new ViewTheatreDetailPageForSuperAdmin(mockQueryService);

    await expect(useCase.execute('missing-theatre')).rejects.toThrow(NotFoundError);
    expect(mockQueryService.getTheatreDetailForSuperAdmin).toHaveBeenCalledWith('missing-theatre');
  });

  it('should return SuperAdminTheatreDetail when theatre is found', async () => {
    const mockQueryService = {
      getTheatreDetailForSuperAdmin: vi.fn().mockResolvedValue(mockDetail),
    } as unknown as ITheatreQueryService;

    const useCase = new ViewTheatreDetailPageForSuperAdmin(mockQueryService);

    const result = await useCase.execute('theatre-1');
    expect(mockQueryService.getTheatreDetailForSuperAdmin).toHaveBeenCalledWith('theatre-1');
    expect(result).toEqual(mockDetail);
    expect(result.statistics.totalScreens).toBe(3);
    expect(result.statistics.totalSeats).toBe(450);
  });

  it('should return SuperAdminTheatreDetail when searched by slug', async () => {
    const mockQueryService = {
      getTheatreDetailForSuperAdmin: vi.fn().mockResolvedValue(mockDetail),
    } as unknown as ITheatreQueryService;

    const useCase = new ViewTheatreDetailPageForSuperAdmin(mockQueryService);

    const result = await useCase.execute('pvr-forum-mall');
    expect(mockQueryService.getTheatreDetailForSuperAdmin).toHaveBeenCalledWith('pvr-forum-mall');
    expect(result.slug).toBe('pvr-forum-mall');
  });
});

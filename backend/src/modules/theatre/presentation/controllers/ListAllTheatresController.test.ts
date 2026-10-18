import { describe, it, expect, vi } from 'vitest';
import { ListAllTheatresController } from './ListAllTheatresController';
import { ListAllTheatreForAdminUseCase } from '../../application/queries/ListAllTheatreForAdminUseCase';
import { Role } from '../../../../shared/enums/Role';

describe('ListAllTheatresController', () => {
  it('should return 200 with paginated theatres for super admin', async () => {
    const mockUseCase = {
      execute: vi.fn().mockResolvedValue({
        items: [
          {
            id: 'th-1',
            name: 'PVR Theatres',
            slug: 'pvr-theatres',
            email: 'pvr@example.com',
            phone: '1234567890',
            logoUrl: 'https://example.com/logo.jpg',
            address: '123 Main St',
            licenseNumber: 'LIC-001',
            isActive: true,
            totalScreens: 4,
            city: { id: 'c-1', name: 'Bangalore' },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          totalPages: 1,
        },
      }),
    } as unknown as ListAllTheatreForAdminUseCase;

    const controller = new ListAllTheatresController(mockUseCase);

    const response = await controller.handle({
      params: undefined,
      body: undefined,
      query: {
        search: 'PVR',
        status: 'ACTIVE',
        page: 1,
        limit: 20,
      },
      user: {
        userId: 'admin-123',
        role: Role.SUPER_ADMIN,
      },
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Theatres fetched successfully.');
    expect((response.body.data as any).items).toHaveLength(1);
    expect((response.body.data as any).pagination.total).toBe(1);
    expect(mockUseCase.execute).toHaveBeenCalledWith({
      query: {
        search: 'PVR',
        status: 'ACTIVE',
        page: 1,
        limit: 20,
      },
    });
  });

  it('should throw UnauthorizedError when user is missing', async () => {
    const mockUseCase = {
      execute: vi.fn(),
    } as unknown as ListAllTheatreForAdminUseCase;

    const controller = new ListAllTheatresController(mockUseCase);

    await expect(
      controller.handle({
        params: undefined,
        body: undefined,
        query: {
          search: undefined,
          status: 'ALL',
          page: 1,
          limit: 20,
        },
      }),
    ).rejects.toThrow('Authentication required');
  });
});

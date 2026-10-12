import { describe, it, expect, vi } from 'vitest';
import { GetMyTheatresController } from './GetMyTheatresController';
import { GetMyTheatresUseCase } from '../../application/queries/GetMyTheatresUseCase';
import { Theatre } from '../../domain/entities/Theatre';
import { Role } from '../../../../shared/enums/Role';

describe('GetMyTheatresController', () => {
  it('should return 200 and list of theatres in framework-agnostic HttpResponse', async () => {
    const mockTheatre = Theatre.create({
      id: 'th-1',
      cityId: 'c-1',
      name: 'PVR Cinemas',
      slug: 'pvr-cinemas',
      address: 'Downtown Street',
      licenseNumber: 'LIC-123',
      description: 'Cinema hall',
      logoUrl: 'https://example.com/logo.jpg',
      logoPublicId: 'logo-1',
      email: 'pvr@example.com',
      phone: '1234567890',
      latitude: 12.9716,
      longitude: 77.5946,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const mockUseCase = {
      execute: vi.fn().mockResolvedValue([
        {
          theatre: mockTheatre,
          city: {
            id: 'c-1',
            name: 'Bangalore',
            state: 'Karnataka',
            country: 'India',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      ]),
    } as unknown as GetMyTheatresUseCase;

    const controller = new GetMyTheatresController(mockUseCase);

    const response = await controller.handle({
      params: undefined,
      body: undefined,
      query: undefined,
      user: {
        userId: 'admin-123',
        role: Role.THEATRE_ADMIN,
      },
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Theatres retrieved successfully');
    const data = response.body.data as Record<string, unknown>[];
    expect(data).toHaveLength(1);
    expect(data[0].name).toBe('PVR Cinemas');
    expect(mockUseCase.execute).toHaveBeenCalledWith('admin-123');
  });

  it('should throw UnauthorizedError when user is not present', async () => {
    const mockUseCase = {
      execute: vi.fn(),
    } as unknown as GetMyTheatresUseCase;

    const controller = new GetMyTheatresController(mockUseCase);

    await expect(
      controller.handle({
        params: undefined,
        body: undefined,
        query: undefined,
      }),
    ).rejects.toThrow('Authentication required');
  });
});

import { describe, it, expect, vi } from 'vitest';
import { CreateTheatreController } from './CreateTheatreController';
import { Role } from '../../../../shared/enums/Role';
import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';

describe('CreateTheatreController', () => {
  it('should call useCase with body and authenticated userId, returning 201 Created', async () => {
    const mockUseCase = {
      execute: vi.fn().mockResolvedValue({
        id: 'th-1',
        cityId: 'c-1',
        name: 'INOX Garuda',
        slug: 'inox-garuda',
        address: 'Magrath Road',
        createdById: 'admin-super-1',
        isActive: true,
      }),
    };

    const controller = new CreateTheatreController(mockUseCase as any);

    const fakeLogoBuffer = Buffer.from('img-bytes');
    const response = await controller.handle({
      params: {},
      query: {},
      body: {
        cityId: 'c-1',
        name: 'INOX Garuda',
        address: 'Magrath Road',
        isActive: true,
        facilityIds: [],
      },
      user: {
        userId: 'admin-super-1',
        role: Role.SUPER_ADMIN,
      },
      file: {
        buffer: fakeLogoBuffer,
      },
    });

    expect(mockUseCase.execute).toHaveBeenCalledWith({
      cityId: 'c-1',
      name: 'INOX Garuda',
      address: 'Magrath Road',
      isActive: true,
      facilityIds: [],
      createdById: 'admin-super-1',
      logoFile: { buffer: fakeLogoBuffer },
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Theatre created successfully');
    expect(response.body.data?.id).toBe('th-1');
  });

  it('should throw UnauthorizedError when user is missing from request', async () => {
    const mockUseCase = { execute: vi.fn() };
    const controller = new CreateTheatreController(mockUseCase as any);

    await expect(
      controller.handle({
        params: {},
        query: {},
        body: {
          cityId: 'c-1',
          name: 'INOX',
          address: 'Road',
          isActive: true,
          facilityIds: [],
        },
      }),
    ).rejects.toThrow(UnauthorizedError);

    expect(mockUseCase.execute).not.toHaveBeenCalled();
  });
});

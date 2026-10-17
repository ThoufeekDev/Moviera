import { describe, it, expect, vi } from 'vitest';
import { ListFacilitiesController } from './ListFacilitiesController';
import { CreateFacilityController } from './CreateFacilityController';
import { EditFacilityController } from './EditFacilityController';
import { ToggleFacilityStatusController } from './ToggleFacilityStatusController';
import { Role } from '../../../../shared/enums/Role';

describe('Facility Controllers', () => {
  describe('ListFacilitiesController', () => {
    it('should return 200 with paginated facilities for super admin', async () => {
      const mockUseCase = {
        execute: vi.fn().mockResolvedValue({
          items: [
            {
              id: 'fac-1',
              name: 'Parking',
              slug: 'parking',
              description: 'Car parking',
              iconKey: 'parking',
              isActive: true,
              assignedTheatreCount: 3,
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
      } as any;

      const controller = new ListFacilitiesController(mockUseCase);
      const res = await controller.handle({
        query: { search: 'park', status: 'ACTIVE', page: 1, limit: 20 },
        user: { userId: 'admin-1', role: Role.SUPER_ADMIN },
      } as any);

      expect(res.status).toBe(200);
      expect((res.body.data as any).items).toHaveLength(1);
      expect(mockUseCase.execute).toHaveBeenCalledWith({
        query: { search: 'park', status: 'ACTIVE', page: 1, limit: 20 },
      });
    });

    it('should reject unauthenticated request with 401 UnauthorizedError', async () => {
      const controller = new ListFacilitiesController({} as any);
      await expect(
        controller.handle({ query: {}, user: undefined } as any),
      ).rejects.toThrow('Authentication required');
    });
  });

  describe('CreateFacilityController', () => {
    it('should return 201 with created facility', async () => {
      const mockUseCase = {
        execute: vi.fn().mockResolvedValue({
          id: 'fac-1',
          name: 'Food Court',
          slug: 'food-court',
          description: 'Cafeteria',
          iconKey: 'food_court',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      } as any;

      const controller = new CreateFacilityController(mockUseCase);
      const res = await controller.handle({
        body: { name: 'Food Court', description: 'Cafeteria', iconKey: 'food_court' },
        user: { userId: 'admin-1', role: Role.SUPER_ADMIN },
      } as any);

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Facility created successfully.');
      expect((res.body.data as any).name).toBe('Food Court');
    });

    it('should reject unauthenticated request with 401', async () => {
      const controller = new CreateFacilityController({} as any);
      await expect(
        controller.handle({ body: { name: 'WiFi' }, user: undefined } as any),
      ).rejects.toThrow('Authentication required');
    });
  });

  describe('EditFacilityController', () => {
    it('should return 200 with edited facility', async () => {
      const mockUseCase = {
        execute: vi.fn().mockResolvedValue({
          id: 'fac-1',
          name: 'Fast WiFi',
          slug: 'wifi',
          description: 'Gigabit wifi',
          iconKey: 'wifi',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      } as any;

      const controller = new EditFacilityController(mockUseCase);
      const res = await controller.handle({
        params: { facilityId: 'fac-1' },
        body: { name: 'Fast WiFi', description: 'Gigabit wifi', iconKey: 'wifi' },
        user: { userId: 'admin-1', role: Role.SUPER_ADMIN },
      } as any);

      expect(res.status).toBe(200);
      expect((res.body.data as any).name).toBe('Fast WiFi');
    });
  });

  describe('ToggleFacilityStatusController', () => {
    it('should return 200 with updated status', async () => {
      const mockUseCase = {
        execute: vi.fn().mockResolvedValue({
          id: 'fac-1',
          name: 'Parking',
          slug: 'parking',
          isActive: false,
        }),
      } as any;

      const controller = new ToggleFacilityStatusController(mockUseCase);
      const res = await controller.handle({
        params: { facilityId: 'fac-1' },
        body: { isActive: false },
        user: { userId: 'admin-1', role: Role.SUPER_ADMIN },
      } as any);

      expect(res.status).toBe(200);
      expect((res.body.data as any).isActive).toBe(false);
    });
  });
});

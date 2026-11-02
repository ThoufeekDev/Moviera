import { describe, it, expect, vi } from 'vitest';
import { GetSuperAdminTheatreDetailController } from './GetSuperAdminTheatreDetailController';
import { ViewTheatreDetailPageForSuperAdmin } from '../../application/queries/ViewTheatreDetailPageForSuperAdmin';
import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import { Role } from '../../../../shared/enums/Role';

describe('GetSuperAdminTheatreDetailController', () => {
  it('should throw UnauthorizedError when req.user.userId is missing', async () => {
    const mockUseCase = {
      execute: vi.fn(),
    } as unknown as ViewTheatreDetailPageForSuperAdmin;

    const controller = new GetSuperAdminTheatreDetailController(mockUseCase);

    await expect(
      controller.handle({
        params: { theatreId: 'theatre-1' },
      } as any),
    ).rejects.toThrow(UnauthorizedError);

    expect(mockUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return 200 with theatre details when authenticated', async () => {
    const mockDetail = {
      id: 'theatre-1',
      name: 'PVR Nexus',
      slug: 'pvr-nexus',
      statistics: {
        totalScreens: 5,
        totalSeats: 600,
        todayShows: 20,
        todayBookings: 120,
      },
    };

    const mockUseCase = {
      execute: vi.fn().mockResolvedValue(mockDetail),
    } as unknown as ViewTheatreDetailPageForSuperAdmin;

    const controller = new GetSuperAdminTheatreDetailController(mockUseCase);

    const res = await controller.handle({
      params: { theatreId: 'theatre-1' },
      user: { userId: 'super-admin-1', role: Role.SUPER_ADMIN },
    } as any);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(mockDetail);
    expect(mockUseCase.execute).toHaveBeenCalledWith('theatre-1');
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ListScreenUseCase } from './ListScreensUseCase';
import type { IScreenQueryService } from '../ports/IScreenQueryService';
import type { ITheatreAccessPolicy } from '../ports/ITheatreAccessPolicy';
import type { ScreenListItem } from '../read-models/ScreenListItem';
import type { PaginatedResult } from '../../../../shared/types/Pagination';
import { Role } from '../../../../shared/enums/Role';
import { ForbiddenError } from '../../../../shared/errors/ForbiddenError';

const actor = { userId: 'admin-1', role: Role.THEATRE_ADMIN };

const paginated: PaginatedResult<ScreenListItem> = {
  items: [
    {
      id: 'screen-1',
      theatreId: 'theatre-1',
      name: 'Audi 1',
      slug: 'audi-1',
      isActive: true,
      totalSeats: 120,
      totalRows: 6,
      totalShows: 4,
      seatConfigurationStatus: 'CONFIGURED',
    },
  ],
  pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
};

describe('ListScreenUseCase', () => {
  let queryService: { listByTheatre: ReturnType<typeof vi.fn> };
  let accessPolicy: { canManage: ReturnType<typeof vi.fn> };
  let useCase: ListScreenUseCase;

  beforeEach(() => {
    queryService = { listByTheatre: vi.fn().mockResolvedValue(paginated) };
    accessPolicy = { canManage: vi.fn().mockResolvedValue(true) };
    useCase = new ListScreenUseCase(
      queryService as unknown as IScreenQueryService,
      accessPolicy as unknown as ITheatreAccessPolicy,
    );
  });

  it('returns paginated screens for an assigned theatre admin and forwards filters', async () => {
    const query = { search: 'audi', status: 'ACTIVE' as const, page: 2, limit: 20 };

    const result = await useCase.execute({ theatreId: 'theatre-1', actor, query });

    expect(accessPolicy.canManage).toHaveBeenCalledWith(actor, 'theatre-1');
    expect(queryService.listByTheatre).toHaveBeenCalledWith('theatre-1', query);
    expect(result).toEqual(paginated);
  });

  it('throws ForbiddenError and does not query when the admin is not assigned', async () => {
    accessPolicy.canManage.mockResolvedValue(false);

    await expect(
      useCase.execute({ theatreId: 'theatre-2', actor }),
    ).rejects.toThrow(ForbiddenError);
    expect(queryService.listByTheatre).not.toHaveBeenCalled();
  });
});


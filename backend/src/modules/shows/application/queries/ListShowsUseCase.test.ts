import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Role } from '../../../../shared/enums/Role';
import { BadRequestError } from '../../../../shared/errors/BadRequestError';
import { ForbiddenError } from '../../../../shared/errors/ForbiddenError';
import { NotFoundError } from '../../../../shared/errors/NotFoundError';
import type { IScreenDetailsReader, ITheatreAccessPolicy } from '../../../theatre';
import type { IShowQueryService } from '../ports/IShowQueryService';
import { ListShowsUseCase } from './ListShowsUseCase';

describe('ListShowsUseCase', () => {
  let showQueryService: { listShows: ReturnType<typeof vi.fn> };
  let theatreAccessPolicy: { canManage: ReturnType<typeof vi.fn> };
  let screenDetailsReader: { findScreenDetailsById: ReturnType<typeof vi.fn> };
  let useCase: ListShowsUseCase;

  beforeEach(() => {
    showQueryService = {
      listShows: vi.fn().mockResolvedValue({
        items: [],
        pagination: { page: 1, limit: 20, total: 0, totalPages: 1 },
      }),
    };
    theatreAccessPolicy = {
      canManage: vi.fn().mockResolvedValue(true),
    };
    screenDetailsReader = {
      findScreenDetailsById: vi.fn().mockResolvedValue({
        id: 'screen-1',
        theatreId: 'theatre-1',
        isActive: true,
      }),
    };

    useCase = new ListShowsUseCase(
      showQueryService as unknown as IShowQueryService,
      theatreAccessPolicy as unknown as ITheatreAccessPolicy,
      screenDetailsReader as unknown as IScreenDetailsReader,
    );
  });

  it('scopes THEATRE_ADMIN queries by theatreAdminUserId', async () => {
    await useCase.execute({
      actor: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
      query: { page: 1, limit: 20, status: 'ALL' },
    });

    expect(showQueryService.listShows).toHaveBeenCalledWith(
      expect.objectContaining({
        theatreAdminUserId: 'admin-1',
      }),
    );
  });

  it('does not restrict SUPER_ADMIN by theatreAdminUserId', async () => {
    await useCase.execute({
      actor: { userId: 'super-1', role: Role.SUPER_ADMIN },
      query: { page: 1, limit: 20, status: 'ALL' },
    });

    expect(showQueryService.listShows).toHaveBeenCalledWith(
      expect.objectContaining({
        theatreAdminUserId: undefined,
      }),
    );
  });

  it('rejects regular USER role', async () => {
    await expect(
      useCase.execute({
        actor: { userId: 'user-1', role: Role.USER },
      }),
    ).rejects.toThrow(ForbiddenError);
  });

  it('rejects when THEATRE_ADMIN requests shows for an unassigned theatreId', async () => {
    theatreAccessPolicy.canManage.mockResolvedValue(false);

    await expect(
      useCase.execute({
        actor: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
        query: { theatreId: 'unassigned-theatre' },
      }),
    ).rejects.toThrow(ForbiddenError);
  });

  it('validates screen ownership when screenId filter is provided', async () => {
    screenDetailsReader.findScreenDetailsById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        actor: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
        query: { screenId: 'missing-screen' },
      }),
    ).rejects.toThrow(NotFoundError);

    screenDetailsReader.findScreenDetailsById.mockResolvedValue({
      id: 'screen-1',
      theatreId: 'theatre-2',
      isActive: true,
    });

    await expect(
      useCase.execute({
        actor: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
        query: { theatreId: 'theatre-1', screenId: 'screen-1' },
      }),
    ).rejects.toThrow(BadRequestError);
  });
});


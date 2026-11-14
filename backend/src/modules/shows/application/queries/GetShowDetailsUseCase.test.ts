import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Role } from '../../../../shared/enums/Role';
import { ForbiddenError } from '../../../../shared/errors/ForbiddenError';
import { NotFoundError } from '../../../../shared/errors/NotFoundError';
import type { ITheatreAccessPolicy } from '../../../theatre';
import { ShowStatus } from '../../domain/enums/ShowStatus';
import type { IShowQueryService } from '../ports/IShowQueryService';
import { GetShowDetailsUseCase } from './GetShowDetailsUseCase';

describe('GetShowDetailsUseCase', () => {
  let showQueryService: { findShowDetailById: ReturnType<typeof vi.fn> };
  let theatreAccessPolicy: { canManage: ReturnType<typeof vi.fn> };
  let useCase: GetShowDetailsUseCase;

  beforeEach(() => {
    showQueryService = {
      findShowDetailById: vi.fn().mockResolvedValue({
        id: 'show-1',
        status: ShowStatus.DRAFT,
        theatre: {
          id: 'theatre-1',
          name: 'PVR Nexus',
          cityName: 'Kochi',
          cleaningBufferMinutes: 15,
          isActive: true,
        },
      }),
    };

    theatreAccessPolicy = {
      canManage: vi.fn().mockResolvedValue(true),
    };

    useCase = new GetShowDetailsUseCase(
      showQueryService as unknown as IShowQueryService,
      theatreAccessPolicy as unknown as ITheatreAccessPolicy,
    );
  });

  it('returns show details when actor is authorized', async () => {
    const detail = await useCase.execute({
      actor: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
      showId: 'show-1',
    });

    expect(detail.id).toBe('show-1');
    expect(theatreAccessPolicy.canManage).toHaveBeenCalledWith(
      { userId: 'admin-1', role: Role.THEATRE_ADMIN },
      'theatre-1',
    );
  });

  it('throws NotFoundError when show does not exist', async () => {
    showQueryService.findShowDetailById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        actor: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
        showId: 'missing',
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it('throws ForbiddenError when actor cannot manage owning theatre', async () => {
    theatreAccessPolicy.canManage.mockResolvedValue(false);

    await expect(
      useCase.execute({
        actor: { userId: 'other-admin', role: Role.THEATRE_ADMIN },
        showId: 'show-1',
      }),
    ).rejects.toThrow(ForbiddenError);
  });
});


import { describe, expect, it, vi } from 'vitest';
import { Role } from '../../../../shared/enums/Role';
import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import type { CancelShowUseCase } from '../../application/commands/CancelShowUseCase';
import type { CreateShowUseCase } from '../../application/commands/CreateShowUseCase';
import type { PublishShowUseCase } from '../../application/commands/PublishShowUseCase';
import type { UpdateShowUseCase } from '../../application/commands/UpdateShowUseCase';
import type { GetShowDetailsUseCase } from '../../application/queries/GetShowDetailsUseCase';
import type { ListShowsUseCase } from '../../application/queries/ListShowsUseCase';
import { ShowStatus } from '../../domain/enums/ShowStatus';
import { CancelShowController } from './CancelShowController';
import { CreateShowController } from './CreateShowController';
import { GetShowDetailsController } from './GetShowDetailsController';
import { ListShowsController } from './ListShowsController';
import { PublishShowController } from './PublishShowController';
import { UpdateShowController } from './UpdateShowController';

describe('Show Presentation Controllers', () => {
  const user = { userId: 'admin-1', role: Role.THEATRE_ADMIN };

  it('CreateShowController returns 201 and throws UnauthorizedError when unauthenticated', async () => {
    const useCase = {
      execute: vi.fn().mockResolvedValue({
        id: 'show-1',
        status: ShowStatus.DRAFT,
      }),
    };
    const controller = new CreateShowController(useCase as unknown as CreateShowUseCase);

    await expect(
      controller.handle({
        params: {},
        body: {
          movieId: 'movie-1',
          screenId: 'screen-1',
          cinemaFormatId: 'format-1',
          startTime: new Date(),
          basePrice: 20000,
          priceAdjustments: {},
        },
        query: {},
      }),
    ).rejects.toThrow(UnauthorizedError);

    const response = await controller.handle({
      user,
      params: {},
      body: {
        movieId: 'movie-1',
        screenId: 'screen-1',
        cinemaFormatId: 'format-1',
        startTime: new Date(),
        basePrice: 20000,
        priceAdjustments: {},
      },
      query: {},
    });

    expect(response.status).toBe(201);
  });

  it('PublishShowController, CancelShowController, UpdateShowController, ListShowsController, and GetShowDetailsController return 200', async () => {
    const publishController = new PublishShowController({
      execute: vi.fn().mockResolvedValue({ id: 'show-1', status: ShowStatus.PUBLISHED }),
    } as unknown as PublishShowUseCase);

    const cancelController = new CancelShowController({
      execute: vi.fn().mockResolvedValue({ id: 'show-1', status: ShowStatus.CANCELLED }),
    } as unknown as CancelShowUseCase);

    const updateController = new UpdateShowController({
      execute: vi.fn().mockResolvedValue({ id: 'show-1', status: ShowStatus.DRAFT }),
    } as unknown as UpdateShowUseCase);

    const listController = new ListShowsController({
      execute: vi.fn().mockResolvedValue({
        items: [],
        pagination: { page: 1, limit: 20, total: 0, totalPages: 1 },
      }),
    } as unknown as ListShowsUseCase);

    const detailController = new GetShowDetailsController({
      execute: vi.fn().mockResolvedValue({ id: 'show-1' }),
    } as unknown as GetShowDetailsUseCase);

    const pubRes = await publishController.handle({
      user,
      params: { showId: 'show-1' },
      body: {},
      query: {},
    });
    expect(pubRes.status).toBe(200);

    const cancelRes = await cancelController.handle({
      user,
      params: { showId: 'show-1' },
      body: {},
      query: {},
    });
    expect(cancelRes.status).toBe(200);

    const updateRes = await updateController.handle({
      user,
      params: { showId: 'show-1' },
      body: { basePrice: 25000 },
      query: {},
    });
    expect(updateRes.status).toBe(200);

    const listRes = await listController.handle({
      user,
      params: { theatreId: 'theatre-1' },
      body: {},
      query: { status: 'ALL', page: 1, limit: 20 },
    });
    expect(listRes.status).toBe(200);

    const detailRes = await detailController.handle({
      user,
      params: { showId: 'show-1' },
      body: {},
      query: {},
    });
    expect(detailRes.status).toBe(200);
  });
});

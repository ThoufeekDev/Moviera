import { describe, it, expect, vi } from 'vitest';
import { CreateScreenController } from './CreateScreenController';
import { ListScreensController } from './ListScreenController';
import type { CreateScreenUseCase } from '../../application/commands/CreateScreenUseCase';
import type { ListScreenUseCase } from '../../application/queries/ListScreensUseCase';
import type { HttpRequest } from '../../../../shared/http/HttpTypes';
import type { CreateScreenInput } from '../schemas/CreateScreenSchema';
import type { ListScreensQueryInput } from '../schemas/ListScreenSchema';
import type { GetTheatreOverviewParamInput } from '../schemas/TheatreParamsSchema';
import { Role } from '../../../../shared/enums/Role';
import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';

const user = { userId: 'admin-1', role: Role.THEATRE_ADMIN };

describe('Screen controllers', () => {
  describe('CreateScreenController', () => {
    const screenResult = {
      id: 'screen-1',
      theatreId: 'theatre-1',
      name: 'Audi 1',
      slug: 'audi-1',
      isActive: true,
      createdAt: new Date('2026-01-01T00:00:00Z'),
      updatedAt: new Date('2026-01-01T00:00:00Z'),
    };

    const buildRequest = (
      withUser = true,
    ): HttpRequest<unknown, CreateScreenInput> => ({
      params: {},
      body: { theatreId: 'theatre-1', name: 'Audi 1' },
      query: {},
      user: withUser ? user : undefined,
    });

    it('returns 201 with the created screen and passes the authenticated actor', async () => {
      const execute = vi.fn().mockResolvedValue(screenResult);
      const controller = new CreateScreenController({ execute } as unknown as CreateScreenUseCase);

      const res = await controller.handle(buildRequest());

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        success: true,
        message: 'Screen created successfully.',
        data: screenResult,
      });
      expect(execute).toHaveBeenCalledWith({
        theatreId: 'theatre-1',
        name: 'Audi 1',
        actor: user,
      });
    });

    it('rejects unauthenticated requests', async () => {
      const execute = vi.fn();
      const controller = new CreateScreenController({ execute } as unknown as CreateScreenUseCase);

      await expect(controller.handle(buildRequest(false))).rejects.toThrow(UnauthorizedError);
      expect(execute).not.toHaveBeenCalled();
    });
  });

  describe('ListScreensController', () => {
    const query: ListScreensQueryInput = { search: 'audi', status: 'ALL', page: 1, limit: 20 };
    const paginated = {
      items: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    };

    const buildRequest = (
      withUser = true,
    ): HttpRequest<GetTheatreOverviewParamInput, unknown, ListScreensQueryInput> => ({
      params: { theatreId: 'theatre-1' },
      body: undefined,
      query,
      user: withUser ? user : undefined,
    });

    it('returns 200 with paginated screens for the theatre', async () => {
      const execute = vi.fn().mockResolvedValue(paginated);
      const controller = new ListScreensController({ execute } as unknown as ListScreenUseCase);

      const res = await controller.handle(buildRequest());

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual(paginated);
      expect(execute).toHaveBeenCalledWith({ theatreId: 'theatre-1', actor: user, query });
    });

    it('rejects unauthenticated requests', async () => {
      const execute = vi.fn();
      const controller = new ListScreensController({ execute } as unknown as ListScreenUseCase);

      await expect(controller.handle(buildRequest(false))).rejects.toThrow(UnauthorizedError);
      expect(execute).not.toHaveBeenCalled();
    });
  });
});


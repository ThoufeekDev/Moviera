import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import type { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { ok } from '../../../../shared/http/response';
import type { PaginatedResult } from '../../../../shared/types/Pagination';
import type { ListShowsUseCase } from '../../application/queries/ListShowsUseCase';
import type { ShowListItem } from '../../application/read-models/ShowListItem';
import type { ListShowsQueryInput } from '../schemas/ListShowsSchema';
import type { TheatreShowsParamInput } from '../schemas/ShowParamsSchema';

export class ListShowsController {
  constructor(private readonly listShowsUseCase: ListShowsUseCase) {}

  handle = async (
    req: HttpRequest<Partial<TheatreShowsParamInput>, unknown, ListShowsQueryInput>,
  ): Promise<HttpResponse<PaginatedResult<ShowListItem>>> => {
    if (!req.user?.userId) {
      throw new UnauthorizedError('Authentication required');
    }

    const theatreId = req.params?.theatreId ?? req.query?.theatreId;

    const result = await this.listShowsUseCase.execute({
      actor: {
        userId: req.user.userId,
        role: req.user.role,
      },
      query: {
        ...req.query,
        ...(theatreId ? { theatreId } : {}),
      },
    });

    return ok(result, 'Shows fetched successfully.');
  };
}


import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { ok } from '../../../../shared/http/response';
import type { PaginatedResult } from '../../../../shared/types/Pagination';
import { ListScreenUseCase } from '../../application/queries/ListScreensUseCase';
import type { ScreenListItem } from '../../application/read-models/ScreenListItem';
import type { GetTheatreOverviewParamInput } from '../schemas/TheatreParamsSchema';
import type { ListScreensQueryInput } from '../schemas/ListScreenSchema';

export class ListScreensController {
  constructor(
    private readonly listScreenUseCase: ListScreenUseCase,
  ) {}

  handle = async (
    req: HttpRequest<GetTheatreOverviewParamInput, unknown, ListScreensQueryInput>,
  ): Promise<HttpResponse<PaginatedResult<ScreenListItem>>> => {
    if (!req.user?.userId) {
      throw new UnauthorizedError('Authentication required');
    }

    const result = await this.listScreenUseCase.execute({
      theatreId: req.params.theatreId,
      actor: {
        userId: req.user.userId,
        role: req.user.role,
      },
      query: req.query,
    });

    return ok(result, 'Screens fetched successfully.');
  };
}

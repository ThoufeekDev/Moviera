import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { ok } from '../../../../shared/http/response';
import { ListScreenUseCase } from '../../application/queries/ListScreensUseCase';
export interface ListScreensParams {
  theatreId: string;
}

export interface ListScreensQuery {
  page?: number;
  limit?: number;
}

export class ListScreensController {
  constructor(
    private readonly listScreenUseCase: ListScreenUseCase,
  ) {}

  handle = async (
    req: HttpRequest<ListScreensParams, unknown, ListScreensQuery>,
  ): Promise<HttpResponse> => {
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
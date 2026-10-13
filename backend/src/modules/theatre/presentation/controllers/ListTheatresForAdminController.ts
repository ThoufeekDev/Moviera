import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { ok } from '../../../../shared/http/response';
import { ListTheatresForAdminUseCase } from '../../application/queries/ListTheatresForAdminUseCase';
import { ListTheatresForAdminQueryInput } from '../schemas/ListTheatresForAdminSchema';

export class ListTheatresForAdminController {
  constructor(
    private readonly listTheatresForAdminUseCase: ListTheatresForAdminUseCase,
  ) {}

  handle = async (
    req: HttpRequest<unknown, unknown, ListTheatresForAdminQueryInput>,
  ): Promise<HttpResponse> => {
    if (!req.user?.userId) throw new UnauthorizedError('Authentication required');

    const result = await this.listTheatresForAdminUseCase.execute({
      query: req.query,
    });

    return ok(result, 'Theatres fetched successfully.');
  };
}

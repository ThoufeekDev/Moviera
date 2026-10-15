import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { ok } from '../../../../shared/http/response';
import { ListAllTheatreForAdminUseCase } from '../../application/queries/ListAllTheatreForAdminUseCase';
import { ListAllTheatresQueryInput } from '../schemas/ListAllTheatresSchema';

export class ListAllTheatresController {
  constructor(
    private readonly listAllTheatresUseCase: ListAllTheatreForAdminUseCase,
  ) {}

  handle = async (
    req: HttpRequest<unknown, unknown, ListAllTheatresQueryInput>,
  ): Promise<HttpResponse> => {
    if (!req.user?.userId) throw new UnauthorizedError('Authentication required');

    const result = await this.listAllTheatresUseCase.execute({
      query: req.query,
    });

    return ok(result, 'Theatres fetched successfully.');
  };
}

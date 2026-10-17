import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { ok } from '../../../../shared/http/response';
import { ListActiveFacilitiesUseCase } from '../../application/queries/ListActiveFacilitiesUseCase';

export class ListActiveFacilitiesController {
  constructor(
    private readonly listActiveFacilitiesUseCase: ListActiveFacilitiesUseCase,
  ) {}

  handle = async (req: HttpRequest): Promise<HttpResponse> => {
    if (!req.user?.userId) throw new UnauthorizedError('Authentication required');

    const result = await this.listActiveFacilitiesUseCase.execute();

    return ok(result, 'Active facilities fetched successfully.');
  };
}

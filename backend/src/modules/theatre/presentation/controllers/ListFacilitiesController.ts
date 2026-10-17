import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { ok } from '../../../../shared/http/response';
import { ListFacilitiesUseCase } from '../../application/queries/ListFacilitiesUseCase';
import { ListFacilitiesQueryInput } from '../schemas/ListFacilitiesSchema';

export class ListFacilitiesController {
  constructor(private readonly listFacilitiesUseCase: ListFacilitiesUseCase) {}

  handle = async (
    req: HttpRequest<unknown, unknown, ListFacilitiesQueryInput>,
  ): Promise<HttpResponse> => {
    if (!req.user?.userId) throw new UnauthorizedError('Authentication required');

    const result = await this.listFacilitiesUseCase.execute({
      query: req.query,
    });

    return ok(result, 'Facilities fetched successfully.');
  };
}

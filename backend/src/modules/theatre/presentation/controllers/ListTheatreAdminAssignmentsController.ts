import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { ok } from '../../../../shared/http/response';
import { ListTheatreAdminAssignmentsUseCase } from '../../application/queries/ListTheatreAdminAssignmentsUseCase';
import { ListTheatreAdminAssignmentsQueryInput } from '../schemas/ListTheatreAdminAssignmentsSchema';

export class ListTheatreAdminAssignmentsController {
  constructor(
    private readonly listTheatreAdminAssignmentsUseCase: ListTheatreAdminAssignmentsUseCase,
  ) {}

  handle = async (
    req: HttpRequest<unknown, unknown, ListTheatreAdminAssignmentsQueryInput>,
  ): Promise<HttpResponse> => {
    if (!req.user?.userId) throw new UnauthorizedError('Authentication required');

    const result = await this.listTheatreAdminAssignmentsUseCase.execute({
      query: req.query,
    });

    return ok(result, 'Theatre admin assignments fetched successfully.');
  };
}

import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { ok } from '../../../../shared/http/response';
import { ListEligibleTheatreAdminsUseCase } from '../../application/queries/ListEligibleTheatreAdminsUseCase';
import { ListEligibleAdminsQueryInput } from '../schemas/ListEligibleAdminsSchema';

export class ListEligibleTheatreAdminsController {
  constructor(
    private readonly listEligibleTheatreAdminsUseCase: ListEligibleTheatreAdminsUseCase,
  ) {}

  handle = async (
    req: HttpRequest<unknown, unknown, ListEligibleAdminsQueryInput>,
  ): Promise<HttpResponse> => {
    if (!req.user?.userId) throw new UnauthorizedError('Authentication required');

    const result = await this.listEligibleTheatreAdminsUseCase.execute({
      query: req.query,
    });

  

    return ok(result, 'Eligible theatre admins fetched successfully.');
  };
}

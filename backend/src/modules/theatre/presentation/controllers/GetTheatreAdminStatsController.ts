import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { ok } from '../../../../shared/http/response';
import { GetTheatreAdminStatsUseCase } from '../../application/queries/GetTheatreAdminStatsUseCase';

export class GetTheatreAdminStatsController {
  constructor(
    private readonly getTheatreAdminStatsUseCase: GetTheatreAdminStatsUseCase,
  ) {}

  handle = async (req: HttpRequest): Promise<HttpResponse> => {
    if (!req.user?.userId) throw new UnauthorizedError('Authentication required');

    const result = await this.getTheatreAdminStatsUseCase.execute();

    return ok(result, 'Theatre admin statistics fetched successfully.');
  };
}

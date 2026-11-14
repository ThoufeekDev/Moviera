import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import type { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { ok } from '../../../../shared/http/response';
import type { GetShowDetailsUseCase } from '../../application/queries/GetShowDetailsUseCase';
import type { ShowDetail } from '../../application/read-models/ShowDetail';
import type { ShowIdParamInput } from '../schemas/ShowParamsSchema';

export class GetShowDetailsController {
  constructor(private readonly getShowDetailsUseCase: GetShowDetailsUseCase) {}

  handle = async (
    req: HttpRequest<ShowIdParamInput>,
  ): Promise<HttpResponse<ShowDetail>> => {
    if (!req.user?.userId) {
      throw new UnauthorizedError('Authentication required');
    }

    const result = await this.getShowDetailsUseCase.execute({
      actor: {
        userId: req.user.userId,
        role: req.user.role,
      },
      showId: req.params.showId,
    });

    return ok(result, 'Show details fetched successfully.');
  };
}


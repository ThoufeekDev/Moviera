import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import type { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { ok } from '../../../../shared/http/response';
import type { CancelShowUseCase } from '../../application/commands/CancelShowUseCase';
import type { ShowResultDTO } from '../../application/dtos/ShowResultDTO';
import type { ShowIdParamInput } from '../schemas/ShowParamsSchema';

export class CancelShowController {
  constructor(private readonly cancelShowUseCase: CancelShowUseCase) {}

  handle = async (
    req: HttpRequest<ShowIdParamInput>,
  ): Promise<HttpResponse<ShowResultDTO>> => {
    if (!req.user?.userId) {
      throw new UnauthorizedError('Authentication required');
    }

    const result = await this.cancelShowUseCase.execute({
      actor: {
        userId: req.user.userId,
        role: req.user.role,
      },
      showId: req.params.showId,
    });

    return ok(result, 'Show cancelled successfully.');
  };
}


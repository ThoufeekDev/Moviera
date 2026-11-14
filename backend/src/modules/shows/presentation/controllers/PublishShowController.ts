import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import type { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { ok } from '../../../../shared/http/response';
import type { PublishShowUseCase } from '../../application/commands/PublishShowUseCase';
import type { ShowResultDTO } from '../../application/dtos/ShowResultDTO';
import type { ShowIdParamInput } from '../schemas/ShowParamsSchema';

export class PublishShowController {
  constructor(private readonly publishShowUseCase: PublishShowUseCase) {}

  handle = async (
    req: HttpRequest<ShowIdParamInput>,
  ): Promise<HttpResponse<ShowResultDTO>> => {
    if (!req.user?.userId) {
      throw new UnauthorizedError('Authentication required');
    }

    const result = await this.publishShowUseCase.execute({
      actor: {
        userId: req.user.userId,
        role: req.user.role,
      },
      showId: req.params.showId,
    });

    return ok(result, 'Show published successfully.');
  };
}


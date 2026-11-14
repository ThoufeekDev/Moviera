import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import type { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { ok } from '../../../../shared/http/response';
import type { UpdateShowUseCase } from '../../application/commands/UpdateShowUseCase';
import type { ShowResultDTO } from '../../application/dtos/ShowResultDTO';
import type { ShowIdParamInput } from '../schemas/ShowParamsSchema';
import type { UpdateShowInput } from '../schemas/UpdateShowSchema';

export class UpdateShowController {
  constructor(private readonly updateShowUseCase: UpdateShowUseCase) {}

  handle = async (
    req: HttpRequest<ShowIdParamInput, UpdateShowInput>,
  ): Promise<HttpResponse<ShowResultDTO>> => {
    if (!req.user?.userId) {
      throw new UnauthorizedError('Authentication required');
    }

    const result = await this.updateShowUseCase.execute({
      actor: {
        userId: req.user.userId,
        role: req.user.role,
      },
      showId: req.params.showId,
      ...(req.body.movieId !== undefined ? { movieId: req.body.movieId } : {}),
      ...(req.body.cinemaFormatId !== undefined
        ? { cinemaFormatId: req.body.cinemaFormatId }
        : {}),
      ...(req.body.startTime !== undefined ? { startTime: req.body.startTime } : {}),
      ...(req.body.endTime !== undefined ? { endTime: req.body.endTime } : {}),
      ...(req.body.basePrice !== undefined ? { basePrice: req.body.basePrice } : {}),
      ...(req.body.priceAdjustments !== undefined
        ? { priceAdjustments: req.body.priceAdjustments }
        : {}),
    });

    return ok(result, 'Show updated successfully.');
  };
}


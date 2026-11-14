import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import type { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { created } from '../../../../shared/http/response';
import type { CreateShowUseCase } from '../../application/commands/CreateShowUseCase';
import type { ShowResultDTO } from '../../application/dtos/ShowResultDTO';
import type { CreateShowInput } from '../schemas/CreateShowSchema';

export class CreateShowController {
  constructor(private readonly createShowUseCase: CreateShowUseCase) {}

  handle = async (
    req: HttpRequest<unknown, CreateShowInput>,
  ): Promise<HttpResponse<ShowResultDTO>> => {
    if (!req.user?.userId) {
      throw new UnauthorizedError('Authentication required');
    }

    const result = await this.createShowUseCase.execute({
      actor: {
        userId: req.user.userId,
        role: req.user.role,
      },
      movieId: req.body.movieId,
      screenId: req.body.screenId,
      cinemaFormatId: req.body.cinemaFormatId,
      startTime: req.body.startTime,
      ...(req.body.endTime ? { endTime: req.body.endTime } : {}),
      basePrice: req.body.basePrice,
      priceAdjustments: req.body.priceAdjustments,
    });

    return created(result, 'Show created successfully.');
  };
}


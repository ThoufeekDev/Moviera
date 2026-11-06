import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import type { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { ok } from '../../../../shared/http/response';
import type { GetScreenSeatLayoutUseCase } from '../../application/queries/GetScreenSeatLayoutUseCase';
import { SeatResponseMapper, type SeatResponse } from '../response-mappers/SeatResponseMapper';

interface GetScreenSeatLayoutParams {
  screenId: string;
}

export class GetScreenSeatLayoutController {
  constructor(
    private readonly getScreenSeatLayoutUseCase: GetScreenSeatLayoutUseCase,
  ) {}

  handle = async (
    req: HttpRequest<GetScreenSeatLayoutParams>,
  ): Promise<HttpResponse<SeatResponse[]>> => {
    if (!req.user?.userId) {
      throw new UnauthorizedError('Authentication required');
    }

    const seats = await this.getScreenSeatLayoutUseCase.execute({
      screenId: req.params.screenId,
      actor: {
        userId: req.user.userId,
        role: req.user.role,
      },
    });

    return ok(SeatResponseMapper.toListResponse(seats), 'Seat layout retrieved successfully');
  };
}

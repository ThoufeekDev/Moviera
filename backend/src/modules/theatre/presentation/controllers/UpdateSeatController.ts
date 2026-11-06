import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import type { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { ok } from '../../../../shared/http/response';
import type { UpdateSeatUseCase } from '../../application/commands/UpdateSeatUseCase';
import type { UpdateSeatInput } from '../schemas/UpdateSeatSchema';
import { SeatResponseMapper, type SeatResponse } from '../response-mappers/SeatResponseMapper';

interface UpdateSeatParams {
  seatId: string;
}

export class UpdateSeatController {
  constructor(
    private readonly updateSeatUseCase: UpdateSeatUseCase,
  ) {}

  handle = async (
    req: HttpRequest<UpdateSeatParams, UpdateSeatInput>,
  ): Promise<HttpResponse<SeatResponse>> => {
    if (!req.user?.userId) {
      throw new UnauthorizedError('Authentication required');
    }

    const updatedSeat = await this.updateSeatUseCase.execute({
      seatId: req.params.seatId,
      actor: {
        userId: req.user.userId,
        role: req.user.role,
      },
      ...req.body,
    });

    return ok(SeatResponseMapper.toResponse(updatedSeat), 'Seat updated successfully');
  };
}

import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import type { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { ok } from '../../../../shared/http/response';
import type { UpdateSeatPropertiesUseCase } from '../../application/commands/UpdateSeatPropertiesUseCase';
import type { UpdateSeatPropertiesInput } from '../schemas/UpdateSeatPropertiesSchema';
import { SeatResponseMapper, type SeatResponse } from '../response-mappers/SeatResponseMapper';

interface UpdateSeatPropertiesParams {
  screenId: string;
}

export class UpdateSeatPropertiesController {
  constructor(
    private readonly updateSeatPropertiesUseCase: UpdateSeatPropertiesUseCase,
  ) {}

  handle = async (
    req: HttpRequest<UpdateSeatPropertiesParams, UpdateSeatPropertiesInput>,
  ): Promise<HttpResponse<SeatResponse[]>> => {
    if (!req.user?.userId) {
      throw new UnauthorizedError('Authentication required');
    }

    const updatedSeats = await this.updateSeatPropertiesUseCase.execute({
      screenId: req.params.screenId,
      actor: {
        userId: req.user.userId,
        role: req.user.role,
      },
      seats: req.body.seats,
    });

    return ok(
      SeatResponseMapper.toListResponse(updatedSeats),
      'Seat properties updated successfully',
    );
  };
}


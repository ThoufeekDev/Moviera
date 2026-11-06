import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import type { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { created } from '../../../../shared/http/response';
import { CreateSeatUseCase } from '../../application/commands/CreateSeatUseCase';
import type { CreateSeatDTO } from '../../application/dtos/CreateSeatDTO';
import { SeatResponseMapper, type SeatResponse } from '../response-mappers/SeatResponseMapper';

interface CreateSeatParams {
  screenId: string;
}

export class CreateSeatController {
  constructor(private readonly createSeatUseCase: CreateSeatUseCase) {}

  handle = async (
    req: HttpRequest<CreateSeatParams, Omit<CreateSeatDTO, 'screenId' | 'actor'>>,
  ): Promise<HttpResponse<SeatResponse>> => {
    if (!req.user?.userId) throw new UnauthorizedError('Authentication required');
    const newSeat = await this.createSeatUseCase.execute({
      ...req.body,
      screenId: req.params.screenId,
      actor: {
        userId: req.user?.userId,
        role: req.user?.role,
      },
    });

    return created(SeatResponseMapper.toResponse(newSeat), 'Seat created successfully');
  };
}

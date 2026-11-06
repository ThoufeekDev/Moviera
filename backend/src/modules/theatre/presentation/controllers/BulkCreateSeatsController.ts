import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import type { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { created } from '../../../../shared/http/response';
import { BulkCreateSeatsUseCase } from '../../application/commands/BulkCreateSeatsUseCase';
import type { BulkCreateSeatsInput } from '../schemas/CreateSeatSchema';
import { SeatResponseMapper, type SeatResponse } from '../response-mappers/SeatResponseMapper';

interface BulkCreateSeatsParams {
  screenId: string;
}

export class BulkCreateSeatsController {
  constructor(
    private readonly bulkCreateSeatsUseCase: BulkCreateSeatsUseCase,
  ) {}

  handle = async (
    req: HttpRequest<BulkCreateSeatsParams, BulkCreateSeatsInput>,
  ): Promise<HttpResponse<SeatResponse[]>> => {
    if (!req.user?.userId) {
      throw new UnauthorizedError('Authentication required');
    }

    const createdSeats = await this.bulkCreateSeatsUseCase.execute({
      ...req.body,
      screenId: req.params.screenId,
      actor: {
        userId: req.user.userId,
        role: req.user.role,
      },
    });

    return created(SeatResponseMapper.toListResponse(createdSeats), 'Seats created successfully');
  };
}

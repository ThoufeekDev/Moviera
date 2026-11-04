
import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import type { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { ok } from '../../../../shared/http/response';

import type { UpdateSeatLayoutUseCase } from '../../application/commands/UpdateSeatLayoutUseCase';
import type { UpdateSeatLayoutInput } from '../schemas/UpdateSeatLayoutSchema';

interface UpdateSeatLayoutParams {
  screenId: string;
}

export class UpdateSeatLayoutController {
  constructor(
    private readonly updateSeatLayoutUseCase: UpdateSeatLayoutUseCase,
  ) {}

  handle = async (
    req: HttpRequest<UpdateSeatLayoutParams, UpdateSeatLayoutInput>,
  ): Promise<HttpResponse> => {
    if (!req.user?.userId) {
      throw new UnauthorizedError('Authentication required');
    }

    const updatedSeats = await this.updateSeatLayoutUseCase.execute({
      screenId: req.params.screenId,
      actor: {
        userId: req.user.userId,
        role: req.user.role,
      },
      seats: req.body.seats,
    });

    return ok(updatedSeats, 'Seat layout updated successfully');
  };
}

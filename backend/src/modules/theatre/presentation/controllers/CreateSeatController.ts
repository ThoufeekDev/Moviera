import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { created } from '../../../../shared/http/response';
import { CreateSeatUseCase } from '../../application/commands/CreateSeatUseCase';
import { CreateSeatDTO } from '../../application/dtos/CreateSeatDTO';

interface CreateSeatParams {
  screenId: string;
}

export class CreateSeatController {
  constructor(private readonly createSeatUseCase: CreateSeatUseCase) {}

  handle = async (
    req: HttpRequest<CreateSeatParams, Omit<CreateSeatDTO, 'screenId' | 'actor'>>,
  ): Promise<HttpResponse> => {
    if (!req.user?.userId) throw new UnauthorizedError('Authentication required');
    await this.createSeatUseCase.execute({
      ...req.body,
      screenId: req.params.screenId,
      actor: {
        userId: req.user?.userId,
        role: req.user?.role,
      },
    });

    return created('Seat created successfully');
  };
}

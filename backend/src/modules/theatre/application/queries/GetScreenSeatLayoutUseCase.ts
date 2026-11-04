
import type { IUseCase } from '../../../../shared/application/interfaces/IUseCase';
import { BadRequestError } from '../../../../shared/errors/BadRequestError';
import { NotFoundError } from '../../../../shared/errors/NotFoundError';
import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import { ForbiddenError } from '../../../../shared/errors/ForbiddenError';
import { ConflictError } from '../../../../shared/errors/ConflictError';

import type { ISeatRepository } from '../../domain/repositories/ISeatRepository';
import type { IScreenRepository } from '../../domain/repositories/IScreenRepository';
import type { Seat } from '../../domain/entities/Seat';
import type { TheatreAccessActor, ITheatreAccessPolicy } from '../ports/ITheatreAccessPolicy';

export class GetScreenSeatLayoutUseCase
  implements IUseCase<
    { screenId: string; actor: TheatreAccessActor },
    Seat[]
  >
{
  constructor(
    private readonly seatRepository: ISeatRepository,
    private readonly screenRepository: IScreenRepository,
    private readonly theatreAccessPolicy: ITheatreAccessPolicy,
  ) {}

  async execute(request: {
    screenId: string;
    actor: TheatreAccessActor;
  }): Promise<Seat[]> {
    const { screenId, actor } = request;

    if (!screenId) {
      throw new BadRequestError('Screen ID is required');
    }

    if (!actor.userId) {
      throw new UnauthorizedError('Authentication required');
    }

    const screen = await this.screenRepository.findById(screenId);

    if (!screen) {
      throw new NotFoundError('Screen not found');
    }

    if (!screen.isActive) {
      throw new ConflictError('Screen is inactive');
    }

    const allowed = await this.theatreAccessPolicy.canManage(
      actor,
      screen.theatreId,
    );

    if (!allowed) {
      throw new ForbiddenError(
        'You are not assigned to manage this theatre',
      );
    }

    return this.seatRepository.findAllSeatByScreenId(screenId);
  }
}

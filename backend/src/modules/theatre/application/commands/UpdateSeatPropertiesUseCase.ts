import type { IUseCase } from '../../../../shared/application/interfaces/IUseCase';
import { BadRequestError } from '../../../../shared/errors/BadRequestError';
import { NotFoundError } from '../../../../shared/errors/NotFoundError';
import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import { ForbiddenError } from '../../../../shared/errors/ForbiddenError';
import { ConflictError } from '../../../../shared/errors/ConflictError';

import type { ISeatRepository } from '../../domain/repositories/ISeatRepository';
import type { IScreenRepository } from '../../domain/repositories/IScreenRepository';
import type { Seat } from '../../domain/entities/Seat';
import type { UpdateSeatPropertiesDTO } from '../dtos/UpdateSeatPropertiesDTO';
import type { ITheatreAccessPolicy } from '../ports/ITheatreAccessPolicy';

export class UpdateSeatPropertiesUseCase
  implements IUseCase<UpdateSeatPropertiesDTO, Seat[]>
{
  constructor(
    private readonly seatRepository: ISeatRepository,
    private readonly screenRepository: IScreenRepository,
    private readonly theatreAccessPolicy: ITheatreAccessPolicy,
  ) {}

  async execute(request: UpdateSeatPropertiesDTO): Promise<Seat[]> {
    const { screenId, actor, seats } = request;

    if (!screenId) {
      throw new BadRequestError('Screen ID is required');
    }

    if (!actor.userId) {
      throw new UnauthorizedError('Authentication required');
    }

    if (seats.length === 0) {
      throw new BadRequestError('At least one seat is required');
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

    const updatedSeats = await this.seatRepository.updateManySeatProperties(
      screenId,
      seats,
    );

    if (!updatedSeats) {
      throw new NotFoundError(
        'One or more seats were not found for this screen',
      );
    }

    return updatedSeats;
  }
}


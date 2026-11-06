import type { IUseCase } from '../../../../shared/application/interfaces/IUseCase';

import { NotFoundError } from '../../../../shared/errors/NotFoundError';
import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import { ConflictError } from '../../../../shared/errors/ConflictError';
import { ForbiddenError } from '../../../../shared/errors/ForbiddenError';

import type { ISeatRepository } from '../../domain/repositories/ISeatRepository';
import type { IScreenRepository } from '../../domain/repositories/IScreenRepository';
import type { Seat } from '../../domain/entities/Seat';
import type { UpdateSeatDTO } from '../dtos/UpdateSeatDTO';
import type { ITheatreAccessPolicy } from '../ports/ITheatreAccessPolicy';

export class UpdateSeatUseCase implements IUseCase<UpdateSeatDTO, Seat> {
  constructor(
    private readonly seatRepository: ISeatRepository,
    private readonly screenRepository: IScreenRepository,
    private readonly theatreAccessPolicy: ITheatreAccessPolicy,
  ) {}

  async execute(request: UpdateSeatDTO): Promise<Seat> {
    const { seatId, actor, type, isActive } = request;

    if (!actor.userId) {
      throw new UnauthorizedError('Authentication required');
    }

    const seat = await this.seatRepository.findById(seatId);

    if (!seat) {
      throw new NotFoundError('Seat not found');
    }

    const screen = await this.screenRepository.findById(seat.screenId);

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

    const updatedSeat = await this.seatRepository.updateSeatDetails(seatId, {
      ...(type !== undefined && { type }),
      ...(isActive !== undefined && { isActive }),
    });

    if (!updatedSeat) {
      throw new NotFoundError('Seat not found');
    }

    return updatedSeat;
  }
}
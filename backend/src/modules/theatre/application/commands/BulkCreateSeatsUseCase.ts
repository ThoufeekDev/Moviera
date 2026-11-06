
import type { ISeatRepository } from '../../domain/repositories/ISeatRepository';
import type { IScreenRepository } from '../../domain/repositories/IScreenRepository';
import type { ITheatreAccessPolicy } from '../ports/ITheatreAccessPolicy';
import type { BulkCreateSeatsDTO } from '../dtos/BulkCreateSeatsDTO';
import type { CreateSeatProps } from '../../domain/types/CreateSeatProps';
import type { IUseCase } from '../../../../shared/application/interfaces/IUseCase';
import type { Seat } from '../../domain/entities/Seat';

import { NotFoundError } from '../../../../shared/errors/NotFoundError';
import { ConflictError } from '../../../../shared/errors/ConflictError';
import { ForbiddenError } from '../../../../shared/errors/ForbiddenError';

export class BulkCreateSeatsUseCase
  implements IUseCase<BulkCreateSeatsDTO, Seat[]>
{
  constructor(
    private readonly seatRepository: ISeatRepository,
    private readonly screenRepository: IScreenRepository,
    private readonly theatreAccessPolicy: ITheatreAccessPolicy,
  ) {}

  async execute(request: BulkCreateSeatsDTO): Promise<Seat[]> {
    // 1. Find screen
    const screen = await this.screenRepository.findById(request.screenId);

    if (!screen) {
      throw new NotFoundError('Screen not found');
    }

    // 2. Check screen status
    if (!screen.isActive) {
      throw new ConflictError('Screen is inactive');
    }

    // 3. Check theatre access
    const allowed = await this.theatreAccessPolicy.canManage(
      request.actor,
      screen.theatreId,
    );

    if (!allowed) {
      throw new ForbiddenError(
        'You are not assigned to manage this theatre',
      );
    }

    // 4. Generate individual seats from row configurations with standard theatre grid coordinates
    const BLOCK_ORIGIN_X = 160;
    const BLOCK_ORIGIN_Y = 120;
    const SEAT_PITCH_X = 30;
    const SEAT_PITCH_Y = 28;
    const WORLD_WIDTH = 3000;
    const WORLD_HEIGHT = 2000;

    const seats: CreateSeatProps[] = request.rows.flatMap(
      (row, rowIndex) => {
        const rowLabel = row.rowLabel.trim().toUpperCase();
        const worldY = BLOCK_ORIGIN_Y + rowIndex * SEAT_PITCH_Y;
        const normalizedY = Math.round((worldY / WORLD_HEIGHT) * 10000) / 10000;

        return Array.from(
          { length: row.seatCount },
          (_, seatIndex) => {
            const seatNumber = seatIndex + 1;
            const worldX = BLOCK_ORIGIN_X + seatIndex * SEAT_PITCH_X;
            const normalizedX = Math.round((worldX / WORLD_WIDTH) * 10000) / 10000;

            return {
              screenId: request.screenId,
              rowLabel,
              seatNumber,
              label: `${rowLabel}${seatNumber}`,
              x: normalizedX,
              y: normalizedY,
              rotation: row.rotation ?? 0,
              type: row.type,
            };
          },
        );
      },
    );

    // 5. Atomically create seats if the screen is empty
    const createdSeats =
      await this.seatRepository.createManyForEmptyScreen(
        request.screenId,
        seats,
      );

    if (!createdSeats) {
      throw new ConflictError(
        'Seats have already been configured for this screen',
      );
    }

    // 6. Return created seats
    return createdSeats;
  }
}

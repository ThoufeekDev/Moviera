import type { IUseCase } from '../../../../shared/application/interfaces/IUseCase';
import { ConflictError } from '../../../../shared/errors/ConflictError';
import { ForbiddenError } from '../../../../shared/errors/ForbiddenError';
import { NotFoundError } from '../../../../shared/errors/NotFoundError';
import type { IScreenDetailsReader, ITheatreAccessPolicy } from '../../../theatre';
import type { IShowRepository } from '../../domain/repositories/IShowRepository';
import type { CancelShowDTO } from '../dtos/CancelShowDTO';
import type { ShowResultDTO } from '../dtos/ShowResultDTO';

export class CancelShowUseCase implements IUseCase<CancelShowDTO, ShowResultDTO> {
  constructor(
    private readonly showRepository: IShowRepository,
    private readonly screenDetailsReader: IScreenDetailsReader,
    private readonly theatreAccessPolicy: ITheatreAccessPolicy,
  ) {}

  async execute(input: CancelShowDTO): Promise<ShowResultDTO> {
    const show = await this.showRepository.findById(input.showId);
    if (!show) {
      throw new NotFoundError('Show not found');
    }

    const screen = await this.screenDetailsReader.findScreenDetailsById(show.screenId);
    if (!screen) {
      throw new NotFoundError('Screen not found');
    }

    const canManage = await this.theatreAccessPolicy.canManage(input.actor, screen.theatreId);
    if (!canManage) {
      throw new ForbiddenError('You do not have permission to cancel shows for this theatre');
    }

    // Domain transition validation (DRAFT -> CANCELLED or PUBLISHED -> CANCELLED)
    show.cancel();

    const activeBookingsCount = await this.showRepository.countActiveBookings(show.id);
    if (activeBookingsCount > 0) {
      throw new ConflictError(
        'Cannot cancel a show that has confirmed or pending bookings',
      );
    }

    const cancelledShow = await this.showRepository.cancel(show);

    return {
      id: cancelledShow.id,
      movieId: cancelledShow.movieId,
      screenId: cancelledShow.screenId,
      cinemaFormatId: cancelledShow.cinemaFormatId,
      startTime: cancelledShow.startTime,
      endTime: cancelledShow.endTime,
      basePrice: cancelledShow.basePrice,
      status: cancelledShow.status,
      createdAt: cancelledShow.createdAt,
      updatedAt: cancelledShow.updatedAt,
    };
  }
}


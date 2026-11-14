import type { IUseCase } from '../../../../shared/application/interfaces/IUseCase';
import { BadRequestError } from '../../../../shared/errors/BadRequestError';
import { ConflictError } from '../../../../shared/errors/ConflictError';
import { ForbiddenError } from '../../../../shared/errors/ForbiddenError';
import { NotFoundError } from '../../../../shared/errors/NotFoundError';
import type { IMovieSchedulingReader } from '../../../movies';
import type { IScreenDetailsReader, ITheatreAccessPolicy } from '../../../theatre';
import {
  DEFAULT_CLEANING_BUFFER_MINUTES,
  MIN_SHOW_SEAT_PRICE_PAISE,
} from '../../domain/constants/ShowPricingConstants';
import type { IShowRepository } from '../../domain/repositories/IShowRepository';
import type { PublishShowDTO } from '../dtos/PublishShowDTO';
import type { ShowResultDTO } from '../dtos/ShowResultDTO';

export class PublishShowUseCase implements IUseCase<PublishShowDTO, ShowResultDTO> {
  constructor(
    private readonly showRepository: IShowRepository,
    private readonly screenDetailsReader: IScreenDetailsReader,
    private readonly movieSchedulingReader: IMovieSchedulingReader,
    private readonly theatreAccessPolicy: ITheatreAccessPolicy,
  ) {}

  async execute(input: PublishShowDTO): Promise<ShowResultDTO> {
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
      throw new ForbiddenError('You do not have permission to publish shows for this theatre');
    }

    // Domain transition validation (DRAFT -> PUBLISHED only)
    show.publish();

    if (screen.theatreIsActive === false) {
      throw new BadRequestError('Cannot publish a show for an inactive theatre');
    }

    if (!screen.isActive) {
      throw new BadRequestError('Cannot publish a show on an inactive screen');
    }

    const movie = await this.movieSchedulingReader.findSchedulingDetailsById(show.movieId);
    if (!movie || !movie.isActive) {
      throw new BadRequestError('Cannot publish a show with an inactive or missing movie');
    }

    if (!movie.theatreFormatIds.includes(show.cinemaFormatId)) {
      throw new BadRequestError('Show cinema format is no longer supported by the movie');
    }

    if (
      Array.isArray(screen.cinemaFormatIds) &&
      !screen.cinemaFormatIds.includes(show.cinemaFormatId)
    ) {
      throw new BadRequestError('Show cinema format is no longer supported by the screen');
    }

    if (!Number.isInteger(show.basePrice) || show.basePrice < MIN_SHOW_SEAT_PRICE_PAISE) {
      throw new BadRequestError('Show base price must be at least 100 paise (₹1)');
    }

    const inventorySummary = await this.showRepository.getSeatInventorySummary(show.id);
    if (inventorySummary.totalSeats === 0) {
      throw new BadRequestError('Cannot publish a show with empty seat inventory');
    }

    if (inventorySummary.minPrice < MIN_SHOW_SEAT_PRICE_PAISE) {
      throw new BadRequestError('All show seats must have a valid price of at least 100 paise (₹1)');
    }

    const cleaningBufferMinutes =
      screen.cleaningBufferMinutes ?? DEFAULT_CLEANING_BUFFER_MINUTES;

    if (this.showRepository.hasSchedulingConflict) {
      const hasConflict = await this.showRepository.hasSchedulingConflict({
        screenId: show.screenId,
        startTime: show.startTime,
        endTime: show.endTime,
        cleaningBufferMinutes,
        excludeShowId: show.id,
      });

      if (hasConflict) {
        throw new ConflictError(
          'Cannot publish show due to a scheduling conflict on this screen',
          { field: 'startTime' },
        );
      }
    }

    const publishedShow = await this.showRepository.publish(show, cleaningBufferMinutes);

    return {
      id: publishedShow.id,
      movieId: publishedShow.movieId,
      screenId: publishedShow.screenId,
      cinemaFormatId: publishedShow.cinemaFormatId,
      startTime: publishedShow.startTime,
      endTime: publishedShow.endTime,
      basePrice: publishedShow.basePrice,
      status: publishedShow.status,
      createdAt: publishedShow.createdAt,
      updatedAt: publishedShow.updatedAt,
    };
  }
}


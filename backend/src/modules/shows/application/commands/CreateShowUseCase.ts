import type { IUseCase } from '../../../../shared/application/interfaces/IUseCase';
import { BadRequestError } from '../../../../shared/errors/BadRequestError';
import { ConflictError } from '../../../../shared/errors/ConflictError';
import { ForbiddenError } from '../../../../shared/errors/ForbiddenError';
import { NotFoundError } from '../../../../shared/errors/NotFoundError';
import type { IMovieSchedulingReader } from '../../../movies';
import type {
  IActiveScreenSeatReader,
  IScreenDetailsReader,
  ITheatreAccessPolicy,
} from '../../../theatre';
import {
  DEFAULT_CLEANING_BUFFER_MINUTES,
  MIN_SHOW_SEAT_PRICE_PAISE,
} from '../../domain/constants/ShowPricingConstants';
import { ShowStatus } from '../../domain/enums/ShowStatus';
import type { IShowRepository } from '../../domain/repositories/IShowRepository';
import type { ShowSeatInventoryInput } from '../../domain/types/CreateShowData';
import type { CreateShowDTO } from '../dtos/CreateShowDTO';
import type { ShowResultDTO } from '../dtos/ShowResultDTO';

export class CreateShowUseCase implements IUseCase<CreateShowDTO, ShowResultDTO> {
  constructor(
    private readonly showRepository: IShowRepository,
    private readonly screenDetailsReader: IScreenDetailsReader,
    private readonly activeScreenSeatReader: IActiveScreenSeatReader,
    private readonly movieSchedulingReader: IMovieSchedulingReader,
    private readonly theatreAccessPolicy: ITheatreAccessPolicy,
  ) {}

  async execute(input: CreateShowDTO): Promise<ShowResultDTO> {
    const screen = await this.screenDetailsReader.findScreenDetailsById(input.screenId);
    if (!screen) {
      throw new NotFoundError('Screen not found');
    }

    const canManage = await this.theatreAccessPolicy.canManage(input.actor, screen.theatreId);
    if (!canManage) {
      throw new ForbiddenError('You do not have permission to manage shows for this theatre');
    }

    if (screen.theatreIsActive === false) {
      throw new BadRequestError('Cannot schedule a show for an inactive theatre', {
        field: 'screenId',
      });
    }

    if (!screen.isActive) {
      throw new BadRequestError('Cannot schedule a show on an inactive screen', {
        field: 'screenId',
      });
    }

    const movie = await this.movieSchedulingReader.findSchedulingDetailsById(input.movieId);
    if (!movie) {
      throw new NotFoundError('Movie not found');
    }

    if (!movie.isActive) {
      throw new BadRequestError('Cannot schedule an inactive movie', {
        field: 'movieId',
      });
    }

    if (!movie.theatreFormatIds.includes(input.cinemaFormatId)) {
      throw new BadRequestError('The selected cinema format is not supported by this movie', {
        field: 'cinemaFormatId',
      });
    }

    if (
      Array.isArray(screen.cinemaFormatIds) &&
      !screen.cinemaFormatIds.includes(input.cinemaFormatId)
    ) {
      throw new BadRequestError('The selected cinema format is not supported by this screen', {
        field: 'cinemaFormatId',
      });
    }

    const activeSeats = await this.activeScreenSeatReader.findActiveByScreenId(input.screenId);
    if (activeSeats.length === 0) {
      throw new BadRequestError('Cannot schedule a show on a screen with no active seats', {
        field: 'screenId',
      });
    }

    if (!(input.startTime instanceof Date) || Number.isNaN(input.startTime.getTime())) {
      throw new BadRequestError('Valid show start time is required', {
        field: 'startTime',
      });
    }

    const calculatedEndTime = new Date(input.startTime.getTime() + movie.duration * 60_000);
    let endTime = calculatedEndTime;

    if (input.endTime !== undefined) {
      if (!(input.endTime instanceof Date) || Number.isNaN(input.endTime.getTime())) {
        throw new BadRequestError('Valid show end time is required', {
          field: 'endTime',
        });
      }

      if (input.endTime.getTime() <= input.startTime.getTime()) {
        throw new BadRequestError('Show end time must be after start time', {
          field: 'endTime',
        });
      }

      if (input.endTime.getTime() < calculatedEndTime.getTime()) {
        throw new BadRequestError('Show end time cannot be earlier than movie duration', {
          field: 'endTime',
        });
      }

      endTime = input.endTime;
    }

    if (!Number.isInteger(input.basePrice) || input.basePrice < MIN_SHOW_SEAT_PRICE_PAISE) {
      throw new BadRequestError('Base price must be an integer of at least 100 paise (₹1)', {
        field: 'basePrice',
      });
    }

    const priceAdjustments = input.priceAdjustments ?? {};
    for (const [seatType, adjustment] of Object.entries(priceAdjustments)) {
      if (adjustment !== undefined && !Number.isInteger(adjustment)) {
        throw new BadRequestError(
          `Price adjustment for seat type ${seatType} must be an integer in paise`,
          { field: 'priceAdjustments' },
        );
      }
    }

    const seats: ShowSeatInventoryInput[] = activeSeats.map((seat) => {
      const priceAdjustment = priceAdjustments[seat.type] ?? 0;
      const price = input.basePrice + priceAdjustment;

      if (price < MIN_SHOW_SEAT_PRICE_PAISE) {
        throw new BadRequestError(
          `Final price for seat type ${seat.type} must be at least 100 paise (₹1)`,
          { field: 'priceAdjustments' },
        );
      }

      return {
        seatId: seat.id,
        price,
        priceAdjustment,
      };
    });

    const cleaningBufferMinutes =
      screen.cleaningBufferMinutes ?? DEFAULT_CLEANING_BUFFER_MINUTES;

    if (this.showRepository.hasSchedulingConflict) {
      const hasConflict = await this.showRepository.hasSchedulingConflict({
        screenId: input.screenId,
        startTime: input.startTime,
        endTime,
        cleaningBufferMinutes,
      });

      if (hasConflict) {
        throw new ConflictError(
          'Screen already has an overlapping show (including cleaning buffer) in the requested time window',
          { field: 'startTime' },
        );
      }
    }

    const createdShow = await this.showRepository.create({
      movieId: input.movieId,
      screenId: input.screenId,
      cinemaFormatId: input.cinemaFormatId,
      startTime: input.startTime,
      endTime,
      basePrice: input.basePrice,
      status: ShowStatus.DRAFT,
      cleaningBufferMinutes,
      seats,
    });

    return {
      id: createdShow.id,
      movieId: createdShow.movieId,
      screenId: createdShow.screenId,
      cinemaFormatId: createdShow.cinemaFormatId,
      startTime: createdShow.startTime,
      endTime: createdShow.endTime,
      basePrice: createdShow.basePrice,
      status: createdShow.status,
      createdAt: createdShow.createdAt,
      updatedAt: createdShow.updatedAt,
    };
  }
}

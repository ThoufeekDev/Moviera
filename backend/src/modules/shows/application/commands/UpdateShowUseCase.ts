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
import type { IShowRepository } from '../../domain/repositories/IShowRepository';
import type { ShowSeatInventoryInput } from '../../domain/types/CreateShowData';
import type { ShowResultDTO } from '../dtos/ShowResultDTO';
import type { UpdateShowDTO } from '../dtos/UpdateShowDTO';

export class UpdateShowUseCase implements IUseCase<UpdateShowDTO, ShowResultDTO> {
  constructor(
    private readonly showRepository: IShowRepository,
    private readonly screenDetailsReader: IScreenDetailsReader,
    private readonly activeScreenSeatReader: IActiveScreenSeatReader,
    private readonly movieSchedulingReader: IMovieSchedulingReader,
    private readonly theatreAccessPolicy: ITheatreAccessPolicy,
  ) {}

  async execute(input: UpdateShowDTO): Promise<ShowResultDTO> {
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
      throw new ForbiddenError('You do not have permission to update shows for this theatre');
    }

    if (screen.theatreIsActive === false) {
      throw new BadRequestError('Cannot update a show for an inactive theatre');
    }

    if (!screen.isActive) {
      throw new BadRequestError('Cannot update a show on an inactive screen');
    }

    const bookingsCount = await this.showRepository.countBookings(show.id);
    const hasBookings = bookingsCount > 0;

    if (hasBookings) {
      if (input.movieId !== undefined && input.movieId !== show.movieId) {
        throw new ConflictError('Cannot change the movie for a show that already has bookings', {
          field: 'movieId',
        });
      }

      if (
        input.cinemaFormatId !== undefined &&
        input.cinemaFormatId !== show.cinemaFormatId
      ) {
        throw new ConflictError(
          'Cannot change the cinema format for a show that already has bookings',
          { field: 'cinemaFormatId' },
        );
      }

      if (input.basePrice !== undefined && input.basePrice !== show.basePrice) {
        throw new ConflictError(
          'Cannot change base price for a show that already has bookings',
          { field: 'basePrice' },
        );
      }

      if (input.priceAdjustments !== undefined) {
        throw new ConflictError(
          'Cannot modify seat price adjustments for a show that already has bookings',
          { field: 'priceAdjustments' },
        );
      }
    }

    const nextMovieId = input.movieId ?? show.movieId;
    const nextCinemaFormatId = input.cinemaFormatId ?? show.cinemaFormatId;
    const nextStartTime = input.startTime ?? show.startTime;
    const nextBasePrice = input.basePrice ?? show.basePrice;

    const movie = await this.movieSchedulingReader.findSchedulingDetailsById(nextMovieId);
    if (!movie) {
      throw new NotFoundError('Movie not found');
    }

    if (!movie.isActive) {
      throw new BadRequestError('Cannot schedule an inactive movie', {
        field: 'movieId',
      });
    }

    if (!movie.theatreFormatIds.includes(nextCinemaFormatId)) {
      throw new BadRequestError('The selected cinema format is not supported by this movie', {
        field: 'cinemaFormatId',
      });
    }

    if (
      Array.isArray(screen.cinemaFormatIds) &&
      !screen.cinemaFormatIds.includes(nextCinemaFormatId)
    ) {
      throw new BadRequestError('The selected cinema format is not supported by this screen', {
        field: 'cinemaFormatId',
      });
    }

    if (!(nextStartTime instanceof Date) || Number.isNaN(nextStartTime.getTime())) {
      throw new BadRequestError('Valid show start time is required', {
        field: 'startTime',
      });
    }

    const calculatedEndTime = new Date(nextStartTime.getTime() + movie.duration * 60_000);
    let nextEndTime: Date;

    if (input.endTime !== undefined) {
      if (!(input.endTime instanceof Date) || Number.isNaN(input.endTime.getTime())) {
        throw new BadRequestError('Valid show end time is required', {
          field: 'endTime',
        });
      }

      if (input.endTime.getTime() <= nextStartTime.getTime()) {
        throw new BadRequestError('Show end time must be after start time', {
          field: 'endTime',
        });
      }

      if (input.endTime.getTime() < calculatedEndTime.getTime()) {
        throw new BadRequestError('Show end time cannot be earlier than movie duration', {
          field: 'endTime',
        });
      }

      nextEndTime = input.endTime;
    } else if (input.startTime !== undefined || input.movieId !== undefined) {
      nextEndTime = calculatedEndTime;
    } else {
      nextEndTime =
        show.endTime.getTime() >= calculatedEndTime.getTime()
          ? show.endTime
          : calculatedEndTime;
    }

    if (!Number.isInteger(nextBasePrice) || nextBasePrice < MIN_SHOW_SEAT_PRICE_PAISE) {
      throw new BadRequestError('Base price must be an integer of at least 100 paise (₹1)', {
        field: 'basePrice',
      });
    }

    // Domain entity validation (rejects CANCELLED show updates, checks startTime/endTime/basePrice)
    show.updateDetails({
      movieId: nextMovieId,
      cinemaFormatId: nextCinemaFormatId,
      startTime: nextStartTime,
      endTime: nextEndTime,
      basePrice: nextBasePrice,
    });

    let seatsToRegenerate: ShowSeatInventoryInput[] | undefined;

    if (!hasBookings && (input.basePrice !== undefined || input.priceAdjustments !== undefined)) {
      const priceAdjustments = input.priceAdjustments ?? {};
      for (const [seatType, adjustment] of Object.entries(priceAdjustments)) {
        if (adjustment !== undefined && !Number.isInteger(adjustment)) {
          throw new BadRequestError(
            `Price adjustment for seat type ${seatType} must be an integer in paise`,
            { field: 'priceAdjustments' },
          );
        }
      }

      const activeSeats = await this.activeScreenSeatReader.findActiveByScreenId(show.screenId);
      if (activeSeats.length === 0) {
        throw new BadRequestError('Cannot update a show on a screen with no active seats', {
          field: 'screenId',
        });
      }

      seatsToRegenerate = activeSeats.map((seat) => {
        const priceAdjustment = priceAdjustments[seat.type] ?? 0;
        const price = nextBasePrice + priceAdjustment;

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
    }

    const cleaningBufferMinutes =
      screen.cleaningBufferMinutes ?? DEFAULT_CLEANING_BUFFER_MINUTES;

    if (this.showRepository.hasSchedulingConflict) {
      const hasConflict = await this.showRepository.hasSchedulingConflict({
        screenId: show.screenId,
        startTime: nextStartTime,
        endTime: nextEndTime,
        cleaningBufferMinutes,
        excludeShowId: show.id,
      });

      if (hasConflict) {
        throw new ConflictError(
          'Screen already has an overlapping show (including cleaning buffer) in the requested time window',
          { field: 'startTime' },
        );
      }
    }

    const updatedShow = await this.showRepository.update({
      showId: show.id,
      screenId: show.screenId,
      movieId: nextMovieId,
      cinemaFormatId: nextCinemaFormatId,
      startTime: nextStartTime,
      endTime: nextEndTime,
      basePrice: nextBasePrice,
      cleaningBufferMinutes,
      seats: seatsToRegenerate,
    });

    return {
      id: updatedShow.id,
      movieId: updatedShow.movieId,
      screenId: updatedShow.screenId,
      cinemaFormatId: updatedShow.cinemaFormatId,
      startTime: updatedShow.startTime,
      endTime: updatedShow.endTime,
      basePrice: updatedShow.basePrice,
      status: updatedShow.status,
      createdAt: updatedShow.createdAt,
      updatedAt: updatedShow.updatedAt,
    };
  }
}

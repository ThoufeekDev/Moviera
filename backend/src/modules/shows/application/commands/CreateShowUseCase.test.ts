import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Role } from '../../../../shared/enums/Role';
import { BadRequestError } from '../../../../shared/errors/BadRequestError';
import { ConflictError } from '../../../../shared/errors/ConflictError';
import { ForbiddenError } from '../../../../shared/errors/ForbiddenError';
import { NotFoundError } from '../../../../shared/errors/NotFoundError';
import type { IMovieSchedulingReader } from '../../../movies';
import {
  SeatType,
  type IActiveScreenSeatReader,
  type IScreenDetailsReader,
  type ITheatreAccessPolicy,
} from '../../../theatre';
import { Show } from '../../domain/entities/Show';
import { ShowStatus } from '../../domain/enums/ShowStatus';
import type { IShowRepository } from '../../domain/repositories/IShowRepository';
import { CreateShowUseCase } from './CreateShowUseCase';

describe('CreateShowUseCase', () => {
  let showRepository: {
    findById: ReturnType<typeof vi.fn>;
    hasSchedulingConflict: ReturnType<typeof vi.fn>;
    getSeatInventorySummary: ReturnType<typeof vi.fn>;
    countActiveBookings: ReturnType<typeof vi.fn>;
    countBookings: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    publish: ReturnType<typeof vi.fn>;
    cancel: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
  let screenDetailsReader: { findScreenDetailsById: ReturnType<typeof vi.fn> };
  let activeScreenSeatReader: { findActiveByScreenId: ReturnType<typeof vi.fn> };
  let movieSchedulingReader: { findSchedulingDetailsById: ReturnType<typeof vi.fn> };
  let theatreAccessPolicy: { canManage: ReturnType<typeof vi.fn> };
  let useCase: CreateShowUseCase;

  const startTime = new Date('2026-12-10T10:00:00.000Z');
  const expectedDefaultEndTime = new Date('2026-12-10T12:30:00.000Z'); // 150 mins

  beforeEach(() => {
    showRepository = {
      findById: vi.fn(),
      hasSchedulingConflict: vi.fn().mockResolvedValue(false),
      getSeatInventorySummary: vi.fn(),
      countActiveBookings: vi.fn(),
      countBookings: vi.fn(),
      create: vi.fn().mockImplementation(async (data) =>
        Show.reconstitute({
          id: 'show-1',
          movieId: data.movieId,
          screenId: data.screenId,
          cinemaFormatId: data.cinemaFormatId,
          startTime: data.startTime,
          endTime: data.endTime,
          basePrice: data.basePrice,
          status: data.status,
          createdAt: new Date('2026-12-01T00:00:00.000Z'),
          updatedAt: new Date('2026-12-01T00:00:00.000Z'),
        }),
      ),
      publish: vi.fn(),
      cancel: vi.fn(),
      update: vi.fn(),
    };

    screenDetailsReader = {
      findScreenDetailsById: vi.fn().mockResolvedValue({
        id: 'screen-1',
        theatreId: 'theatre-1',
        isActive: true,
        theatreIsActive: true,
        cleaningBufferMinutes: 15,
        cinemaFormatIds: ['format-2d', 'format-imax'],
      }),
    };

    activeScreenSeatReader = {
      findActiveByScreenId: vi.fn().mockResolvedValue([
        { id: 'seat-reg-1', type: SeatType.REGULAR },
        { id: 'seat-prem-1', type: SeatType.PREMIUM },
        { id: 'seat-rec-1', type: SeatType.RECLINER },
        { id: 'seat-wheel-1', type: SeatType.WHEELCHAIR },
      ]),
    };

    movieSchedulingReader = {
      findSchedulingDetailsById: vi.fn().mockResolvedValue({
        id: 'movie-1',
        duration: 150,
        isActive: true,
        theatreFormatIds: ['format-2d', 'format-imax'],
      }),
    };

    theatreAccessPolicy = {
      canManage: vi.fn().mockResolvedValue(true),
    };

    useCase = new CreateShowUseCase(
      showRepository as unknown as IShowRepository,
      screenDetailsReader as unknown as IScreenDetailsReader,
      activeScreenSeatReader as unknown as IActiveScreenSeatReader,
      movieSchedulingReader as unknown as IMovieSchedulingReader,
      theatreAccessPolicy as unknown as ITheatreAccessPolicy,
    );
  });

  it('creates a DRAFT show with calculated endTime and ShowSeat inventory with positive and negative adjustments', async () => {
    const result = await useCase.execute({
      actor: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
      movieId: 'movie-1',
      screenId: 'screen-1',
      cinemaFormatId: 'format-imax',
      startTime,
      basePrice: 20000, // ₹200
      priceAdjustments: {
        [SeatType.REGULAR]: 0,
        [SeatType.PREMIUM]: 5000, // +₹50
        [SeatType.RECLINER]: 15000, // +₹150
        [SeatType.WHEELCHAIR]: -5000, // -₹50 => ₹150
      },
    });

    expect(result).toMatchObject({
      id: 'show-1',
      movieId: 'movie-1',
      screenId: 'screen-1',
      cinemaFormatId: 'format-imax',
      startTime,
      endTime: expectedDefaultEndTime,
      basePrice: 20000,
      status: ShowStatus.DRAFT,
    });

    expect(showRepository.hasSchedulingConflict).toHaveBeenCalledWith({
      screenId: 'screen-1',
      startTime,
      endTime: expectedDefaultEndTime,
      cleaningBufferMinutes: 15,
    });

    expect(showRepository.create).toHaveBeenCalledWith({
      movieId: 'movie-1',
      screenId: 'screen-1',
      cinemaFormatId: 'format-imax',
      startTime,
      endTime: expectedDefaultEndTime,
      basePrice: 20000,
      status: ShowStatus.DRAFT,
      cleaningBufferMinutes: 15,
      seats: [
        { seatId: 'seat-reg-1', price: 20000, priceAdjustment: 0 },
        { seatId: 'seat-prem-1', price: 25000, priceAdjustment: 5000 },
        { seatId: 'seat-rec-1', price: 35000, priceAdjustment: 15000 },
        { seatId: 'seat-wheel-1', price: 15000, priceAdjustment: -5000 },
      ],
    });
  });

  it('rejects when screen does not exist', async () => {
    screenDetailsReader.findScreenDetailsById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        actor: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
        movieId: 'movie-1',
        screenId: 'missing-screen',
        cinemaFormatId: 'format-2d',
        startTime,
        basePrice: 20000,
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it('rejects when theatre admin is not assigned to the owning theatre', async () => {
    theatreAccessPolicy.canManage.mockResolvedValue(false);

    await expect(
      useCase.execute({
        actor: { userId: 'unassigned-admin', role: Role.THEATRE_ADMIN },
        movieId: 'movie-1',
        screenId: 'screen-1',
        cinemaFormatId: 'format-2d',
        startTime,
        basePrice: 20000,
      }),
    ).rejects.toThrow(ForbiddenError);
  });

  it('rejects when screen is inactive', async () => {
    screenDetailsReader.findScreenDetailsById.mockResolvedValue({
      id: 'screen-1',
      theatreId: 'theatre-1',
      isActive: false,
      theatreIsActive: true,
      cleaningBufferMinutes: 15,
      cinemaFormatIds: ['format-2d'],
    });

    await expect(
      useCase.execute({
        actor: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
        movieId: 'movie-1',
        screenId: 'screen-1',
        cinemaFormatId: 'format-2d',
        startTime,
        basePrice: 20000,
      }),
    ).rejects.toThrow('Cannot schedule a show on an inactive screen');
  });

  it('rejects when owning theatre is inactive', async () => {
    screenDetailsReader.findScreenDetailsById.mockResolvedValue({
      id: 'screen-1',
      theatreId: 'theatre-1',
      isActive: true,
      theatreIsActive: false,
      cleaningBufferMinutes: 15,
      cinemaFormatIds: ['format-2d'],
    });

    await expect(
      useCase.execute({
        actor: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
        movieId: 'movie-1',
        screenId: 'screen-1',
        cinemaFormatId: 'format-2d',
        startTime,
        basePrice: 20000,
      }),
    ).rejects.toThrow('Cannot schedule a show for an inactive theatre');
  });

  it('rejects when movie does not exist or is inactive', async () => {
    movieSchedulingReader.findSchedulingDetailsById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        actor: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
        movieId: 'missing-movie',
        screenId: 'screen-1',
        cinemaFormatId: 'format-2d',
        startTime,
        basePrice: 20000,
      }),
    ).rejects.toThrow(NotFoundError);

    movieSchedulingReader.findSchedulingDetailsById.mockResolvedValue({
      id: 'movie-1',
      duration: 150,
      isActive: false,
      theatreFormatIds: ['format-2d'],
    });

    await expect(
      useCase.execute({
        actor: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
        movieId: 'movie-1',
        screenId: 'screen-1',
        cinemaFormatId: 'format-2d',
        startTime,
        basePrice: 20000,
      }),
    ).rejects.toThrow('Cannot schedule an inactive movie');
  });

  it('rejects when cinemaFormatId is not supported by the movie', async () => {
    await expect(
      useCase.execute({
        actor: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
        movieId: 'movie-1',
        screenId: 'screen-1',
        cinemaFormatId: 'format-4dx',
        startTime,
        basePrice: 20000,
      }),
    ).rejects.toThrow('The selected cinema format is not supported by this movie');
  });

  it('rejects when cinemaFormatId is not supported by the screen', async () => {
    screenDetailsReader.findScreenDetailsById.mockResolvedValue({
      id: 'screen-1',
      theatreId: 'theatre-1',
      isActive: true,
      theatreIsActive: true,
      cleaningBufferMinutes: 15,
      cinemaFormatIds: ['format-2d'], // does not support format-imax
    });

    await expect(
      useCase.execute({
        actor: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
        movieId: 'movie-1',
        screenId: 'screen-1',
        cinemaFormatId: 'format-imax',
        startTime,
        basePrice: 20000,
      }),
    ).rejects.toThrow('The selected cinema format is not supported by this screen');
  });

  it('rejects when screen has zero active seats', async () => {
    activeScreenSeatReader.findActiveByScreenId.mockResolvedValue([]);

    await expect(
      useCase.execute({
        actor: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
        movieId: 'movie-1',
        screenId: 'screen-1',
        cinemaFormatId: 'format-2d',
        startTime,
        basePrice: 20000,
      }),
    ).rejects.toThrow('Cannot schedule a show on a screen with no active seats');
  });

  it('rejects when manual endTime is earlier than movie duration', async () => {
    await expect(
      useCase.execute({
        actor: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
        movieId: 'movie-1',
        screenId: 'screen-1',
        cinemaFormatId: 'format-2d',
        startTime,
        endTime: new Date('2026-12-10T11:30:00.000Z'), // 90 mins < 150 mins
        basePrice: 20000,
      }),
    ).rejects.toThrow('Show end time cannot be earlier than movie duration');
  });

  it('rejects when negative seat price adjustment drops final seat price below ₹1 (100 paise)', async () => {
    await expect(
      useCase.execute({
        actor: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
        movieId: 'movie-1',
        screenId: 'screen-1',
        cinemaFormatId: 'format-2d',
        startTime,
        basePrice: 15000,
        priceAdjustments: {
          [SeatType.WHEELCHAIR]: -14950, // 15000 - 14950 = 50 paise (< 100 paise)
        },
      }),
    ).rejects.toThrow(BadRequestError);
  });

  it('rejects when an overlapping show or cleaning buffer conflict exists on the screen', async () => {
    showRepository.hasSchedulingConflict.mockResolvedValue(true);

    await expect(
      useCase.execute({
        actor: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
        movieId: 'movie-1',
        screenId: 'screen-1',
        cinemaFormatId: 'format-2d',
        startTime,
        basePrice: 20000,
      }),
    ).rejects.toThrow(ConflictError);
  });
});


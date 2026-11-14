import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DomainError } from '../../../../shared/domain/errors/DomainError';
import { Role } from '../../../../shared/enums/Role';
import { ConflictError } from '../../../../shared/errors/ConflictError';
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
import { UpdateShowUseCase } from './UpdateShowUseCase';

describe('UpdateShowUseCase', () => {
  let showRepository: {
    findById: ReturnType<typeof vi.fn>;
    hasSchedulingConflict: ReturnType<typeof vi.fn>;
    countBookings: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
  let screenDetailsReader: { findScreenDetailsById: ReturnType<typeof vi.fn> };
  let activeScreenSeatReader: { findActiveByScreenId: ReturnType<typeof vi.fn> };
  let movieSchedulingReader: { findSchedulingDetailsById: ReturnType<typeof vi.fn> };
  let theatreAccessPolicy: { canManage: ReturnType<typeof vi.fn> };
  let useCase: UpdateShowUseCase;

  const makeShow = (status: ShowStatus = ShowStatus.DRAFT) =>
    Show.reconstitute({
      id: 'show-1',
      movieId: 'movie-1',
      screenId: 'screen-1',
      cinemaFormatId: 'format-2d',
      startTime: new Date('2026-12-10T10:00:00.000Z'),
      endTime: new Date('2026-12-10T12:30:00.000Z'),
      basePrice: 20000,
      status,
    });

  beforeEach(() => {
    showRepository = {
      findById: vi.fn().mockResolvedValue(makeShow(ShowStatus.DRAFT)),
      hasSchedulingConflict: vi.fn().mockResolvedValue(false),
      countBookings: vi.fn().mockResolvedValue(0),
      update: vi.fn().mockImplementation(async (data) =>
        Show.reconstitute({
          id: data.showId,
          movieId: data.movieId,
          screenId: data.screenId,
          cinemaFormatId: data.cinemaFormatId,
          startTime: data.startTime,
          endTime: data.endTime,
          basePrice: data.basePrice,
          status: ShowStatus.DRAFT,
        }),
      ),
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
        { id: 'seat-1', type: SeatType.REGULAR },
        { id: 'seat-2', type: SeatType.PREMIUM },
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

    useCase = new UpdateShowUseCase(
      showRepository as unknown as IShowRepository,
      screenDetailsReader as unknown as IScreenDetailsReader,
      activeScreenSeatReader as unknown as IActiveScreenSeatReader,
      movieSchedulingReader as unknown as IMovieSchedulingReader,
      theatreAccessPolicy as unknown as ITheatreAccessPolicy,
    );
  });

  it('updates show timing and regenerates seat inventory when pricing changes and no bookings exist', async () => {
    const nextStart = new Date('2026-12-10T14:00:00.000Z');

    const result = await useCase.execute({
      actor: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
      showId: 'show-1',
      startTime: nextStart,
      basePrice: 25000,
      priceAdjustments: {
        [SeatType.REGULAR]: 0,
        [SeatType.PREMIUM]: 5000,
      },
    });

    expect(result.startTime).toEqual(nextStart);
    expect(result.basePrice).toBe(25000);
    expect(showRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        showId: 'show-1',
        basePrice: 25000,
        seats: [
          { seatId: 'seat-1', price: 25000, priceAdjustment: 0 },
          { seatId: 'seat-2', price: 30000, priceAdjustment: 5000 },
        ],
      }),
    );
  });

  it('blocks changing basePrice, priceAdjustments, movieId, or cinemaFormatId when bookings already exist', async () => {
    showRepository.countBookings.mockResolvedValue(2);

    await expect(
      useCase.execute({
        actor: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
        showId: 'show-1',
        basePrice: 30000,
      }),
    ).rejects.toThrow(ConflictError);

    await expect(
      useCase.execute({
        actor: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
        showId: 'show-1',
        priceAdjustments: { [SeatType.PREMIUM]: 8000 },
      }),
    ).rejects.toThrow(ConflictError);

    await expect(
      useCase.execute({
        actor: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
        showId: 'show-1',
        movieId: 'movie-2',
      }),
    ).rejects.toThrow(ConflictError);

    expect(showRepository.update).not.toHaveBeenCalled();
  });

  it('rejects updating a CANCELLED show', async () => {
    showRepository.findById.mockResolvedValue(makeShow(ShowStatus.CANCELLED));

    await expect(
      useCase.execute({
        actor: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
        showId: 'show-1',
        startTime: new Date('2026-12-10T15:00:00.000Z'),
      }),
    ).rejects.toThrow(DomainError);
  });
});


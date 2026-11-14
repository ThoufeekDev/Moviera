import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DomainError } from '../../../../shared/domain/errors/DomainError';
import { Role } from '../../../../shared/enums/Role';
import { BadRequestError } from '../../../../shared/errors/BadRequestError';
import { ConflictError } from '../../../../shared/errors/ConflictError';
import { ForbiddenError } from '../../../../shared/errors/ForbiddenError';
import { NotFoundError } from '../../../../shared/errors/NotFoundError';
import type { IMovieSchedulingReader } from '../../../movies';
import type { IScreenDetailsReader, ITheatreAccessPolicy } from '../../../theatre';
import { Show } from '../../domain/entities/Show';
import { ShowStatus } from '../../domain/enums/ShowStatus';
import type { IShowRepository } from '../../domain/repositories/IShowRepository';
import { PublishShowUseCase } from './PublishShowUseCase';

describe('PublishShowUseCase', () => {
  let showRepository: {
    findById: ReturnType<typeof vi.fn>;
    hasSchedulingConflict: ReturnType<typeof vi.fn>;
    getSeatInventorySummary: ReturnType<typeof vi.fn>;
    publish: ReturnType<typeof vi.fn>;
  };
  let screenDetailsReader: { findScreenDetailsById: ReturnType<typeof vi.fn> };
  let movieSchedulingReader: { findSchedulingDetailsById: ReturnType<typeof vi.fn> };
  let theatreAccessPolicy: { canManage: ReturnType<typeof vi.fn> };
  let useCase: PublishShowUseCase;

  const makeShow = (status: ShowStatus = ShowStatus.DRAFT) =>
    Show.reconstitute({
      id: 'show-1',
      movieId: 'movie-1',
      screenId: 'screen-1',
      cinemaFormatId: 'format-imax',
      startTime: new Date('2026-12-10T10:00:00.000Z'),
      endTime: new Date('2026-12-10T12:30:00.000Z'),
      basePrice: 25000,
      status,
    });

  beforeEach(() => {
    showRepository = {
      findById: vi.fn().mockResolvedValue(makeShow(ShowStatus.DRAFT)),
      hasSchedulingConflict: vi.fn().mockResolvedValue(false),
      getSeatInventorySummary: vi.fn().mockResolvedValue({
        totalSeats: 120,
        minPrice: 20000,
      }),
      publish: vi.fn().mockImplementation(async (show: Show) => show),
    };

    screenDetailsReader = {
      findScreenDetailsById: vi.fn().mockResolvedValue({
        id: 'screen-1',
        theatreId: 'theatre-1',
        isActive: true,
        theatreIsActive: true,
        cleaningBufferMinutes: 15,
        cinemaFormatIds: ['format-imax'],
      }),
    };

    movieSchedulingReader = {
      findSchedulingDetailsById: vi.fn().mockResolvedValue({
        id: 'movie-1',
        duration: 150,
        isActive: true,
        theatreFormatIds: ['format-imax'],
      }),
    };

    theatreAccessPolicy = {
      canManage: vi.fn().mockResolvedValue(true),
    };

    useCase = new PublishShowUseCase(
      showRepository as unknown as IShowRepository,
      screenDetailsReader as unknown as IScreenDetailsReader,
      movieSchedulingReader as unknown as IMovieSchedulingReader,
      theatreAccessPolicy as unknown as ITheatreAccessPolicy,
    );
  });

  it('publishes a DRAFT show when all validations pass', async () => {
    const result = await useCase.execute({
      actor: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
      showId: 'show-1',
    });

    expect(result.status).toBe(ShowStatus.PUBLISHED);
    expect(showRepository.publish).toHaveBeenCalledTimes(1);
  });

  it('rejects when show does not exist', async () => {
    showRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        actor: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
        showId: 'missing',
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it('rejects when actor is not authorized to manage theatre', async () => {
    theatreAccessPolicy.canManage.mockResolvedValue(false);

    await expect(
      useCase.execute({
        actor: { userId: 'other-admin', role: Role.THEATRE_ADMIN },
        showId: 'show-1',
      }),
    ).rejects.toThrow(ForbiddenError);
  });

  it('rejects publishing an already PUBLISHED show (PUBLISHED -> PUBLISHED)', async () => {
    showRepository.findById.mockResolvedValue(makeShow(ShowStatus.PUBLISHED));

    await expect(
      useCase.execute({
        actor: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
        showId: 'show-1',
      }),
    ).rejects.toThrow(DomainError);
  });

  it('rejects publishing a CANCELLED show (CANCELLED -> PUBLISHED)', async () => {
    showRepository.findById.mockResolvedValue(makeShow(ShowStatus.CANCELLED));

    await expect(
      useCase.execute({
        actor: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
        showId: 'show-1',
      }),
    ).rejects.toThrow(DomainError);
  });

  it('rejects publishing when seat inventory is empty', async () => {
    showRepository.getSeatInventorySummary.mockResolvedValue({
      totalSeats: 0,
      minPrice: 0,
    });

    await expect(
      useCase.execute({
        actor: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
        showId: 'show-1',
      }),
    ).rejects.toThrow(BadRequestError);
  });

  it('rejects publishing when a scheduling conflict exists', async () => {
    showRepository.hasSchedulingConflict.mockResolvedValue(true);

    await expect(
      useCase.execute({
        actor: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
        showId: 'show-1',
      }),
    ).rejects.toThrow(ConflictError);
  });
});


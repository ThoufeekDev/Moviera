import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DomainError } from '../../../../shared/domain/errors/DomainError';
import { Role } from '../../../../shared/enums/Role';
import { ConflictError } from '../../../../shared/errors/ConflictError';
import { ForbiddenError } from '../../../../shared/errors/ForbiddenError';
import { NotFoundError } from '../../../../shared/errors/NotFoundError';
import type { IScreenDetailsReader, ITheatreAccessPolicy } from '../../../theatre';
import { Show } from '../../domain/entities/Show';
import { ShowStatus } from '../../domain/enums/ShowStatus';
import type { IShowRepository } from '../../domain/repositories/IShowRepository';
import { CancelShowUseCase } from './CancelShowUseCase';

describe('CancelShowUseCase', () => {
  let showRepository: {
    findById: ReturnType<typeof vi.fn>;
    countActiveBookings: ReturnType<typeof vi.fn>;
    cancel: ReturnType<typeof vi.fn>;
  };
  let screenDetailsReader: { findScreenDetailsById: ReturnType<typeof vi.fn> };
  let theatreAccessPolicy: { canManage: ReturnType<typeof vi.fn> };
  let useCase: CancelShowUseCase;

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
      countActiveBookings: vi.fn().mockResolvedValue(0),
      cancel: vi.fn().mockImplementation(async (show: Show) => show),
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

    theatreAccessPolicy = {
      canManage: vi.fn().mockResolvedValue(true),
    };

    useCase = new CancelShowUseCase(
      showRepository as unknown as IShowRepository,
      screenDetailsReader as unknown as IScreenDetailsReader,
      theatreAccessPolicy as unknown as ITheatreAccessPolicy,
    );
  });

  it('cancels a DRAFT show when there are no active bookings', async () => {
    const result = await useCase.execute({
      actor: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
      showId: 'show-1',
    });

    expect(result.status).toBe(ShowStatus.CANCELLED);
    expect(showRepository.cancel).toHaveBeenCalledTimes(1);
  });

  it('cancels a PUBLISHED show when there are no active bookings', async () => {
    showRepository.findById.mockResolvedValue(makeShow(ShowStatus.PUBLISHED));

    const result = await useCase.execute({
      actor: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
      showId: 'show-1',
    });

    expect(result.status).toBe(ShowStatus.CANCELLED);
  });

  it('rejects cancelling an already CANCELLED show (CANCELLED -> CANCELLED)', async () => {
    showRepository.findById.mockResolvedValue(makeShow(ShowStatus.CANCELLED));

    await expect(
      useCase.execute({
        actor: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
        showId: 'show-1',
      }),
    ).rejects.toThrow(DomainError);
  });

  it('rejects cancelling a show that has confirmed or pending bookings', async () => {
    showRepository.findById.mockResolvedValue(makeShow(ShowStatus.PUBLISHED));
    showRepository.countActiveBookings.mockResolvedValue(3);

    await expect(
      useCase.execute({
        actor: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
        showId: 'show-1',
      }),
    ).rejects.toThrow(ConflictError);

    expect(showRepository.cancel).not.toHaveBeenCalled();
  });

  it('rejects when show is not found or actor is unauthorized', async () => {
    showRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        actor: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
        showId: 'missing',
      }),
    ).rejects.toThrow(NotFoundError);

    showRepository.findById.mockResolvedValue(makeShow(ShowStatus.DRAFT));
    theatreAccessPolicy.canManage.mockResolvedValue(false);

    await expect(
      useCase.execute({
        actor: { userId: 'admin-1', role: Role.THEATRE_ADMIN },
        showId: 'show-1',
      }),
    ).rejects.toThrow(ForbiddenError);
  });
});


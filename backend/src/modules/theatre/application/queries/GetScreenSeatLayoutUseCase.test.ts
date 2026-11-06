import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetScreenSeatLayoutUseCase } from './GetScreenSeatLayoutUseCase';
import { Seat } from '../../domain/entities/Seat';
import { SeatType } from '../../domain/enums/SeatType';
import type { ISeatRepository } from '../../domain/repositories/ISeatRepository';
import type { IScreenRepository } from '../../domain/repositories/IScreenRepository';
import type { ITheatreAccessPolicy } from '../ports/ITheatreAccessPolicy';
import type { Screen } from '../../domain/entities/Screen';
import { Role } from '../../../../shared/enums/Role';
import { BadRequestError } from '../../../../shared/errors/BadRequestError';
import { NotFoundError } from '../../../../shared/errors/NotFoundError';
import { ConflictError } from '../../../../shared/errors/ConflictError';
import { ForbiddenError } from '../../../../shared/errors/ForbiddenError';
import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';

const actor = { userId: 'admin-1', role: Role.THEATRE_ADMIN };

const makeSeat = (id: string): Seat =>
  Seat.create({
    id,
    screenId: 'screen-1',
    rowLabel: 'A',
    seatNumber: 1,
    label: 'A1',
    x: 0.1,
    y: 0.1,
    rotation: 0,
    type: SeatType.REGULAR,
    isActive: true,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
  });

describe('GetScreenSeatLayoutUseCase', () => {
  let seatRepository: {
    findAllSeatByScreenId: ReturnType<typeof vi.fn>;
  };
  let screenRepository: {
    findById: ReturnType<typeof vi.fn>;
  };
  let theatreAccessPolicy: {
    canManage: ReturnType<typeof vi.fn>;
  };
  let useCase: GetScreenSeatLayoutUseCase;

  beforeEach(() => {
    seatRepository = {
      findAllSeatByScreenId: vi.fn().mockResolvedValue([makeSeat('seat-1')]),
    };
    screenRepository = {
      findById: vi.fn().mockResolvedValue({
        id: 'screen-1',
        theatreId: 'theatre-1',
        isActive: true,
      } as Screen),
    };
    theatreAccessPolicy = {
      canManage: vi.fn().mockResolvedValue(true),
    };

    useCase = new GetScreenSeatLayoutUseCase(
      seatRepository as unknown as ISeatRepository,
      screenRepository as unknown as IScreenRepository,
      theatreAccessPolicy as unknown as ITheatreAccessPolicy,
    );
  });

  it('throws BadRequestError when screenId is empty', async () => {
    await expect(
      useCase.execute({
        screenId: '',
        actor,
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('throws UnauthorizedError when actor userId is missing', async () => {
    await expect(
      useCase.execute({
        screenId: 'screen-1',
        actor: { userId: '', role: Role.THEATRE_ADMIN },
      }),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it('throws NotFoundError when screen is not found', async () => {
    screenRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        screenId: 'missing',
        actor,
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it('throws ConflictError when screen is inactive', async () => {
    screenRepository.findById.mockResolvedValue({
      id: 'screen-1',
      theatreId: 'theatre-1',
      isActive: false,
    } as Screen);

    await expect(
      useCase.execute({
        screenId: 'screen-1',
        actor,
      }),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it('throws ForbiddenError when actor cannot manage theatre', async () => {
    theatreAccessPolicy.canManage.mockResolvedValue(false);

    await expect(
      useCase.execute({
        screenId: 'screen-1',
        actor,
      }),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it('returns all seats for screen', async () => {
    const seats = [makeSeat('seat-1'), makeSeat('seat-2')];
    seatRepository.findAllSeatByScreenId.mockResolvedValue(seats);

    const result = await useCase.execute({
      screenId: 'screen-1',
      actor,
    });

    expect(seatRepository.findAllSeatByScreenId).toHaveBeenCalledWith('screen-1');
    expect(result).toEqual(seats);
  });
});


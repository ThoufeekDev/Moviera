import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateSeatUseCase } from './UpdateSeatUseCase';
import { Seat } from '../../domain/entities/Seat';
import { SeatType } from '../../domain/enums/SeatType';
import type { ISeatRepository } from '../../domain/repositories/ISeatRepository';
import type { IScreenRepository } from '../../domain/repositories/IScreenRepository';
import type { ITheatreAccessPolicy } from '../ports/ITheatreAccessPolicy';
import type { Screen } from '../../domain/entities/Screen';
import { Role } from '../../../../shared/enums/Role';
import { NotFoundError } from '../../../../shared/errors/NotFoundError';
import { ConflictError } from '../../../../shared/errors/ConflictError';
import { ForbiddenError } from '../../../../shared/errors/ForbiddenError';
import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';

const actor = { userId: 'admin-1', role: Role.THEATRE_ADMIN };

const makeSeat = (
  id: string,
  type: SeatType = SeatType.REGULAR,
  isActive = true,
): Seat =>
  Seat.create({
    id,
    screenId: 'screen-1',
    rowLabel: 'A',
    seatNumber: 1,
    label: 'A1',
    x: 0.1,
    y: 0.1,
    rotation: 0,
    type,
    isActive,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
  });

describe('UpdateSeatUseCase', () => {
  let seatRepository: {
    findById: ReturnType<typeof vi.fn>;
    updateSeatDetails: ReturnType<typeof vi.fn>;
  };
  let screenRepository: {
    findById: ReturnType<typeof vi.fn>;
  };
  let theatreAccessPolicy: {
    canManage: ReturnType<typeof vi.fn>;
  };
  let useCase: UpdateSeatUseCase;

  beforeEach(() => {
    seatRepository = {
      findById: vi.fn().mockResolvedValue(makeSeat('seat-1')),
      updateSeatDetails: vi.fn(),
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

    useCase = new UpdateSeatUseCase(
      seatRepository as unknown as ISeatRepository,
      screenRepository as unknown as IScreenRepository,
      theatreAccessPolicy as unknown as ITheatreAccessPolicy,
    );
  });

  it('throws UnauthorizedError if actor has no userId', async () => {
    await expect(
      useCase.execute({
        seatId: 'seat-1',
        actor: { userId: '', role: Role.THEATRE_ADMIN },
        type: SeatType.PREMIUM,
      }),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it('throws NotFoundError if seat does not exist', async () => {
    seatRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        seatId: 'missing',
        actor,
        type: SeatType.PREMIUM,
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it('throws NotFoundError if screen does not exist', async () => {
    screenRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        seatId: 'seat-1',
        actor,
        type: SeatType.PREMIUM,
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it('throws ConflictError if screen is inactive', async () => {
    screenRepository.findById.mockResolvedValue({
      id: 'screen-1',
      theatreId: 'theatre-1',
      isActive: false,
    } as Screen);

    await expect(
      useCase.execute({
        seatId: 'seat-1',
        actor,
        type: SeatType.PREMIUM,
      }),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it('throws ForbiddenError if actor cannot manage theatre', async () => {
    theatreAccessPolicy.canManage.mockResolvedValue(false);

    await expect(
      useCase.execute({
        seatId: 'seat-1',
        actor,
        type: SeatType.PREMIUM,
      }),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it('updates seat details and returns the updated seat', async () => {
    const updated = makeSeat('seat-1', SeatType.PREMIUM, false);
    seatRepository.updateSeatDetails.mockResolvedValue(updated);

    const result = await useCase.execute({
      seatId: 'seat-1',
      actor,
      type: SeatType.PREMIUM,
      isActive: false,
    });

    expect(seatRepository.updateSeatDetails).toHaveBeenCalledWith('seat-1', {
      type: SeatType.PREMIUM,
      isActive: false,
    });
    expect(result).toEqual(updated);
  });
});


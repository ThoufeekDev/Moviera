import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateSeatLayoutUseCase } from './UpdateSeatLayoutUseCase';
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

const makeSeat = (id: string, x: number, y: number): Seat =>
  Seat.create({
    id,
    screenId: 'screen-1',
    rowLabel: 'A',
    seatNumber: 1,
    label: 'A1',
    x,
    y,
    rotation: 0,
    type: SeatType.REGULAR,
    isActive: true,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
  });

describe('UpdateSeatLayoutUseCase', () => {
  let seatRepository: {
    updateManySeatPositions: ReturnType<typeof vi.fn>;
  };
  let screenRepository: {
    findById: ReturnType<typeof vi.fn>;
  };
  let theatreAccessPolicy: {
    canManage: ReturnType<typeof vi.fn>;
  };
  let useCase: UpdateSeatLayoutUseCase;

  beforeEach(() => {
    seatRepository = {
      updateManySeatPositions: vi.fn(),
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

    useCase = new UpdateSeatLayoutUseCase(
      seatRepository as unknown as ISeatRepository,
      screenRepository as unknown as IScreenRepository,
      theatreAccessPolicy as unknown as ITheatreAccessPolicy,
    );
  });

  it('throws BadRequestError when screenId is missing', async () => {
    await expect(
      useCase.execute({
        screenId: '',
        actor,
        seats: [{ seatId: 'seat-1', x: 0.2, y: 0.3, rotation: 0 }],
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('throws UnauthorizedError when actor has no userId', async () => {
    await expect(
      useCase.execute({
        screenId: 'screen-1',
        actor: { userId: '', role: Role.THEATRE_ADMIN },
        seats: [{ seatId: 'seat-1', x: 0.2, y: 0.3, rotation: 0 }],
      }),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it('throws BadRequestError when seats array is empty', async () => {
    await expect(
      useCase.execute({
        screenId: 'screen-1',
        actor,
        seats: [],
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('throws NotFoundError when screen does not exist', async () => {
    screenRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        screenId: 'screen-missing',
        actor,
        seats: [{ seatId: 'seat-1', x: 0.2, y: 0.3, rotation: 0 }],
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
        seats: [{ seatId: 'seat-1', x: 0.2, y: 0.3, rotation: 0 }],
      }),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it('throws ForbiddenError when actor cannot manage theatre', async () => {
    theatreAccessPolicy.canManage.mockResolvedValue(false);

    await expect(
      useCase.execute({
        screenId: 'screen-1',
        actor,
        seats: [{ seatId: 'seat-1', x: 0.2, y: 0.3, rotation: 0 }],
      }),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it('updates seat layout and returns updated seats', async () => {
    const updated = [makeSeat('seat-1', 0.5, 0.6)];
    seatRepository.updateManySeatPositions.mockResolvedValue(updated);

    const result = await useCase.execute({
      screenId: 'screen-1',
      actor,
      seats: [{ seatId: 'seat-1', x: 0.5, y: 0.6, rotation: 0 }],
    });

    expect(seatRepository.updateManySeatPositions).toHaveBeenCalledWith(
      'screen-1',
      [{ seatId: 'seat-1', x: 0.5, y: 0.6, rotation: 0 }],
    );
    expect(result).toEqual(updated);
  });
});


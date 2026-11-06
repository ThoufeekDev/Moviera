import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateSeatPropertiesUseCase } from './UpdateSeatPropertiesUseCase';
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

const makeSeat = (id: string, type: SeatType = SeatType.REGULAR, isActive = true): Seat =>
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

describe('UpdateSeatPropertiesUseCase', () => {
  let seatRepository: { updateManySeatProperties: ReturnType<typeof vi.fn> };
  let screenRepository: { findById: ReturnType<typeof vi.fn> };
  let theatreAccessPolicy: { canManage: ReturnType<typeof vi.fn> };
  let useCase: UpdateSeatPropertiesUseCase;

  beforeEach(() => {
    seatRepository = {
      updateManySeatProperties: vi.fn(),
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

    useCase = new UpdateSeatPropertiesUseCase(
      seatRepository as unknown as ISeatRepository,
      screenRepository as unknown as IScreenRepository,
      theatreAccessPolicy as unknown as ITheatreAccessPolicy,
    );
  });

  it('updates seat properties atomically for an authorized theatre admin', async () => {
    const updated = [makeSeat('s1', SeatType.PREMIUM, false)];
    seatRepository.updateManySeatProperties.mockResolvedValue(updated);

    const result = await useCase.execute({
      screenId: 'screen-1',
      actor,
      seats: [{ seatId: 's1', type: SeatType.PREMIUM, isActive: false }],
    });

    expect(screenRepository.findById).toHaveBeenCalledWith('screen-1');
    expect(theatreAccessPolicy.canManage).toHaveBeenCalledWith(actor, 'theatre-1');
    expect(seatRepository.updateManySeatProperties).toHaveBeenCalledWith('screen-1', [
      { seatId: 's1', type: SeatType.PREMIUM, isActive: false },
    ]);
    expect(result).toBe(updated);
  });

  it('throws BadRequestError if screenId is empty', async () => {
    await expect(
      useCase.execute({ screenId: '', actor, seats: [{ seatId: 's1', isActive: false }] }),
    ).rejects.toThrow(BadRequestError);
  });

  it('throws UnauthorizedError if actor.userId is missing', async () => {
    await expect(
      useCase.execute({
        screenId: 'screen-1',
        actor: { userId: '', role: Role.THEATRE_ADMIN },
        seats: [{ seatId: 's1', isActive: false }],
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('throws BadRequestError if seats array is empty', async () => {
    await expect(
      useCase.execute({ screenId: 'screen-1', actor, seats: [] }),
    ).rejects.toThrow(BadRequestError);
  });

  it('throws NotFoundError if screen does not exist', async () => {
    screenRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ screenId: 'screen-1', actor, seats: [{ seatId: 's1', type: SeatType.SOFA }] }),
    ).rejects.toThrow(NotFoundError);
  });

  it('throws ConflictError if screen is inactive', async () => {
    screenRepository.findById.mockResolvedValue({
      id: 'screen-1',
      theatreId: 'theatre-1',
      isActive: false,
    } as Screen);

    await expect(
      useCase.execute({ screenId: 'screen-1', actor, seats: [{ seatId: 's1', type: SeatType.SOFA }] }),
    ).rejects.toThrow(ConflictError);
  });

  it('throws ForbiddenError if actor cannot manage the theatre', async () => {
    theatreAccessPolicy.canManage.mockResolvedValue(false);

    await expect(
      useCase.execute({ screenId: 'screen-1', actor, seats: [{ seatId: 's1', type: SeatType.SOFA }] }),
    ).rejects.toThrow(ForbiddenError);
  });

  it('throws NotFoundError if repository returns null (seats missing or not on this screen)', async () => {
    seatRepository.updateManySeatProperties.mockResolvedValue(null);

    await expect(
      useCase.execute({ screenId: 'screen-1', actor, seats: [{ seatId: 's1', type: SeatType.SOFA }] }),
    ).rejects.toThrow(NotFoundError);
  });
});


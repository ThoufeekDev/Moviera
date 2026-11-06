import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateSeatUseCase } from './CreateSeatUseCase';
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

const actor = { userId: 'admin-1', role: Role.THEATRE_ADMIN };

const makeSeat = (
  id: string,
  rowLabel: string,
  seatNumber: number,
  type: SeatType = SeatType.REGULAR,
): Seat =>
  Seat.create({
    id,
    screenId: 'screen-1',
    rowLabel,
    seatNumber,
    label: `${rowLabel}${seatNumber}`,
    x: 0.1,
    y: 0.1,
    rotation: 0,
    type,
    isActive: true,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
  });

describe('CreateSeatUseCase', () => {
  let seatRepository: {
    findByLabel: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
  };
  let screenRepository: {
    findById: ReturnType<typeof vi.fn>;
  };
  let theatreAccessPolicy: {
    canManage: ReturnType<typeof vi.fn>;
  };
  let useCase: CreateSeatUseCase;

  beforeEach(() => {
    seatRepository = {
      findByLabel: vi.fn().mockResolvedValue(null),
      create: vi.fn(),
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

    useCase = new CreateSeatUseCase(
      seatRepository as unknown as ISeatRepository,
      screenRepository as unknown as IScreenRepository,
      theatreAccessPolicy as unknown as ITheatreAccessPolicy,
    );
  });

  it('throws NotFoundError if screen not found', async () => {
    screenRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        screenId: 'missing',
        actor,
        rowLabel: 'A',
        seatNumber: 1,
        x: 0.1,
        y: 0.1,
        type: SeatType.REGULAR,
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
        screenId: 'screen-1',
        actor,
        rowLabel: 'A',
        seatNumber: 1,
        x: 0.1,
        y: 0.1,
        type: SeatType.REGULAR,
      }),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it('throws ForbiddenError if actor cannot manage theatre', async () => {
    theatreAccessPolicy.canManage.mockResolvedValue(false);

    await expect(
      useCase.execute({
        screenId: 'screen-1',
        actor,
        rowLabel: 'A',
        seatNumber: 1,
        x: 0.1,
        y: 0.1,
        type: SeatType.REGULAR,
      }),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it('throws ConflictError if seat label already exists in screen', async () => {
    seatRepository.findByLabel.mockResolvedValue(makeSeat('seat-1', 'A', 1));

    await expect(
      useCase.execute({
        screenId: 'screen-1',
        actor,
        rowLabel: 'a',
        seatNumber: 1,
        x: 0.1,
        y: 0.1,
        type: SeatType.REGULAR,
      }),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it('creates seat with normalized rowLabel and label', async () => {
    const created = makeSeat('seat-1', 'A', 1);
    seatRepository.create.mockResolvedValue(created);

    const result = await useCase.execute({
      screenId: 'screen-1',
      actor,
      rowLabel: '  a  ',
      seatNumber: 1,
      x: 0.2,
      y: 0.3,
      rotation: 0,
      type: SeatType.REGULAR,
    });

    expect(seatRepository.create).toHaveBeenCalledWith({
      screenId: 'screen-1',
      rowLabel: 'A',
      seatNumber: 1,
      label: 'A1',
      x: 0.2,
      y: 0.3,
      rotation: 0,
      type: SeatType.REGULAR,
    });
    expect(result).toEqual(created);
  });
});


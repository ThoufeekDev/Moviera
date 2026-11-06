import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BulkCreateSeatsUseCase } from './BulkCreateSeatsUseCase';
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

describe('BulkCreateSeatsUseCase', () => {
  let seatRepository: {
    createManyForEmptyScreen: ReturnType<typeof vi.fn>;
  };
  let screenRepository: {
    findById: ReturnType<typeof vi.fn>;
  };
  let theatreAccessPolicy: {
    canManage: ReturnType<typeof vi.fn>;
  };
  let useCase: BulkCreateSeatsUseCase;

  beforeEach(() => {
    seatRepository = {
      createManyForEmptyScreen: vi.fn(),
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

    useCase = new BulkCreateSeatsUseCase(
      seatRepository as unknown as ISeatRepository,
      screenRepository as unknown as IScreenRepository,
      theatreAccessPolicy as unknown as ITheatreAccessPolicy,
    );
  });

  it('throws NotFoundError when screen does not exist', async () => {
    screenRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        actor,
        screenId: 'screen-missing',
        rows: [{ rowLabel: 'A', seatCount: 5, type: SeatType.REGULAR }],
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
        actor,
        screenId: 'screen-1',
        rows: [{ rowLabel: 'A', seatCount: 5, type: SeatType.REGULAR }],
      }),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it('throws ForbiddenError when user cannot manage theatre', async () => {
    theatreAccessPolicy.canManage.mockResolvedValue(false);

    await expect(
      useCase.execute({
        actor,
        screenId: 'screen-1',
        rows: [{ rowLabel: 'A', seatCount: 5, type: SeatType.REGULAR }],
      }),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it('throws ConflictError when seats already exist on screen', async () => {
    seatRepository.createManyForEmptyScreen.mockResolvedValue(null);

    await expect(
      useCase.execute({
        actor,
        screenId: 'screen-1',
        rows: [{ rowLabel: 'A', seatCount: 2, type: SeatType.REGULAR }],
      }),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it('generates seat layout and returns created seats', async () => {
    const mockCreated = [
      makeSeat('seat-1', 'A', 1),
      makeSeat('seat-2', 'A', 2),
    ];
    seatRepository.createManyForEmptyScreen.mockResolvedValue(mockCreated);

    const result = await useCase.execute({
      actor,
      screenId: 'screen-1',
      rows: [
        {
          rowLabel: 'a',
          seatCount: 2,
          type: SeatType.REGULAR,
          rotation: 0,
        },
      ],
    });

    expect(seatRepository.createManyForEmptyScreen).toHaveBeenCalledWith(
      'screen-1',
      [
        {
          screenId: 'screen-1',
          rowLabel: 'A',
          seatNumber: 1,
          label: 'A1',
          x: 0.0533,
          y: 0.06,
          rotation: 0,
          type: SeatType.REGULAR,
        },
        {
          screenId: 'screen-1',
          rowLabel: 'A',
          seatNumber: 2,
          label: 'A2',
          x: 0.0633,
          y: 0.06,
          rotation: 0,
          type: SeatType.REGULAR,
        },
      ],
    );
    expect(result).toEqual(mockCreated);
  });
});


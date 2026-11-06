import { describe, it, expect, vi } from 'vitest';
import { UpdateSeatPropertiesController } from './UpdateSeatPropertiesController';
import type { UpdateSeatPropertiesUseCase } from '../../application/commands/UpdateSeatPropertiesUseCase';
import { Seat } from '../../domain/entities/Seat';
import { SeatType } from '../../domain/enums/SeatType';
import { Role } from '../../../../shared/enums/Role';
import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';

const user = { userId: 'admin-1', role: Role.THEATRE_ADMIN };

const makeSeat = (id: string, type: SeatType = SeatType.PREMIUM): Seat =>
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
    isActive: true,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
  });

describe('UpdateSeatPropertiesController', () => {
  it('returns 200 with mapped plain seat responses on success', async () => {
    const updatedSeats = [makeSeat('s1')];
    const execute = vi.fn().mockResolvedValue(updatedSeats);
    const controller = new UpdateSeatPropertiesController({ execute } as unknown as UpdateSeatPropertiesUseCase);

    const res = await controller.handle({
      params: { screenId: 'screen-1' },
      body: { seats: [{ seatId: 's1', type: SeatType.PREMIUM }] },
      query: {},
      user,
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Seat properties updated successfully');
    // Ensure plain objects, no props wrapping
    expect(res.body.data).toEqual([
      {
        id: 's1',
        screenId: 'screen-1',
        rowLabel: 'A',
        seatNumber: 1,
        label: 'A1',
        x: 0.1,
        y: 0.1,
        rotation: 0,
        type: SeatType.PREMIUM,
        isActive: true,
      },
    ]);
    expect(execute).toHaveBeenCalledWith({
      screenId: 'screen-1',
      actor: user,
      seats: [{ seatId: 's1', type: SeatType.PREMIUM }],
    });
  });

  it('throws UnauthorizedError if user is unauthenticated', async () => {
    const execute = vi.fn();
    const controller = new UpdateSeatPropertiesController({ execute } as unknown as UpdateSeatPropertiesUseCase);

    await expect(
      controller.handle({
        params: { screenId: 'screen-1' },
        body: { seats: [{ seatId: 's1', type: SeatType.PREMIUM }] },
        query: {},
      }),
    ).rejects.toThrow(UnauthorizedError);
  });
});


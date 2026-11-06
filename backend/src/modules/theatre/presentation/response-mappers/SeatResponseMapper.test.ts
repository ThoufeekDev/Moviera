import { describe, it, expect } from 'vitest';
import { Seat } from '../../domain/entities/Seat';
import { SeatType } from '../../domain/enums/SeatType';
import { SeatResponseMapper } from './SeatResponseMapper';

describe('SeatResponseMapper', () => {
  const mockSeatProps = {
    id: 'seat-1',
    screenId: 'screen-1',
    rowLabel: 'A',
    seatNumber: 1,
    label: 'A1',
    x: 0.25,
    y: 0.5,
    rotation: 0,
    type: SeatType.REGULAR,
    isActive: true,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
  };

  const domainSeat = Seat.create(mockSeatProps);

  it('maps a Seat domain entity to a flat plain object without "props" wrapper', () => {
    const response = SeatResponseMapper.toResponse(domainSeat);

    // Verify it is a plain object with the expected fields
    expect(response).toEqual({
      id: 'seat-1',
      screenId: 'screen-1',
      rowLabel: 'A',
      seatNumber: 1,
      label: 'A1',
      x: 0.25,
      y: 0.5,
      rotation: 0,
      type: SeatType.REGULAR,
      isActive: true,
    });

    // Explicitly verify there is no `props` wrapper in JSON serialization
    const serialized = JSON.parse(JSON.stringify(response));
    expect(serialized).not.toHaveProperty('props');
    expect(serialized.id).toBe('seat-1');
  });

  it('maps an array of Seat domain entities', () => {
    const responses = SeatResponseMapper.toListResponse([domainSeat]);

    expect(responses).toHaveLength(1);
    expect(responses[0]).toEqual({
      id: 'seat-1',
      screenId: 'screen-1',
      rowLabel: 'A',
      seatNumber: 1,
      label: 'A1',
      x: 0.25,
      y: 0.5,
      rotation: 0,
      type: SeatType.REGULAR,
      isActive: true,
    });
  });
});


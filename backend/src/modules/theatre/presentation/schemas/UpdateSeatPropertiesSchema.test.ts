import { describe, it, expect } from 'vitest';
import { updateSeatPropertiesSchema } from './UpdateSeatPropertiesSchema';
import { SeatType } from '../../domain/enums/SeatType';

describe('updateSeatPropertiesSchema', () => {
  it('accepts valid seat property updates with type and/or isActive', () => {
    const result = updateSeatPropertiesSchema.safeParse({
      seats: [
        { seatId: 'seat-1', type: SeatType.PREMIUM },
        { seatId: 'seat-2', isActive: false },
        { seatId: 'seat-3', type: SeatType.RECLINER, isActive: true },
      ],
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.seats).toHaveLength(3);
    }
  });

  it('rejects an item that provides neither type nor isActive', () => {
    const result = updateSeatPropertiesSchema.safeParse({
      seats: [{ seatId: 'seat-1' }],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        'At least one property (type or isActive) must be provided',
      );
    }
  });

  it('rejects duplicate seat IDs', () => {
    const result = updateSeatPropertiesSchema.safeParse({
      seats: [
        { seatId: 'seat-1', type: SeatType.SOFA },
        { seatId: 'seat-1', isActive: false },
      ],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain('Duplicate seat IDs are not allowed');
    }
  });

  it('rejects empty seats array', () => {
    const result = updateSeatPropertiesSchema.safeParse({ seats: [] });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid seat type', () => {
    const result = updateSeatPropertiesSchema.safeParse({
      seats: [{ seatId: 'seat-1', type: 'INVALID_TYPE' }],
    });
    expect(result.success).toBe(false);
  });
});


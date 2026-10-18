import { describe, it, expect } from 'vitest';
import { normalizeMarkerPosition } from '../normalizeMarkerPosition';

describe('normalizeMarkerPosition', () => {
  it('normalizes a LatLng-like object with function getters lat() and lng()', () => {
    const obj = {
      lat: () => 12.9716,
      lng: () => 77.5946,
    };
    const result = normalizeMarkerPosition(obj);
    expect(result).toEqual({ lat: 12.9716, lng: 77.5946 });
  });

  it('normalizes a plain literal with numeric lat and lng', () => {
    const literal = { lat: 13.0827, lng: 80.2707 };
    const result = normalizeMarkerPosition(literal);
    expect(result).toEqual({ lat: 13.0827, lng: 80.2707 });
  });

  it('returns null for null or undefined input', () => {
    expect(normalizeMarkerPosition(null)).toBeNull();
    expect(normalizeMarkerPosition(undefined)).toBeNull();
  });

  it('returns null for invalid non-numeric values', () => {
    expect(normalizeMarkerPosition({ lat: NaN, lng: 77.5946 })).toBeNull();
    expect(normalizeMarkerPosition({ lat: '12.9716' as unknown as number, lng: 77.5946 })).toBeNull();
  });
});

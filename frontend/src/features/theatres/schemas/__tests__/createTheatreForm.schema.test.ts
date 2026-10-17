import { describe, it, expect } from 'vitest';
import {
  clientCreateTheatreSchema,
  defaultCreateTheatreFormValues,
} from '../createTheatreForm.schema';

describe('clientCreateTheatreSchema', () => {
  const validMinimalExistingCity = {
    ...defaultCreateTheatreFormValues,
    cityId: 'c123',
    name: 'PVR Cinema',
    address: '123 Main St',
  };

  const validMinimalNewCity = {
    ...defaultCreateTheatreFormValues,
    cityId: '',
    cityName: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    name: 'PVR Cinema',
    address: '123 Main St',
  };

  it('validates minimal valid input with existing city', () => {
    const result = clientCreateTheatreSchema.safeParse(validMinimalExistingCity);
    expect(result.success).toBe(true);
  });

  it('validates minimal valid input with new city details', () => {
    const result = clientCreateTheatreSchema.safeParse(validMinimalNewCity);
    expect(result.success).toBe(true);
  });

  it('rejects invalid pincode', () => {
    const result = clientCreateTheatreSchema.safeParse({
      ...validMinimalExistingCity,
      pincode: '12345', // only 5 digits
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain('Pincode must be exactly 6 digits (e.g. 560001)');
    }
  });

  it('rejects invalid phone', () => {
    const result = clientCreateTheatreSchema.safeParse({
      ...validMinimalExistingCity,
      phone: '1234567890', // invalid start digit (must start with 6-9)
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain(
        'Phone must be a valid 10-digit Indian number (e.g. 9876543210 or +919876543210)',
      );
    }
  });

  it('rejects invalid email', () => {
    const result = clientCreateTheatreSchema.safeParse({
      ...validMinimalExistingCity,
      email: 'not-an-email',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain(
        'Please enter a valid email address (e.g. contact@cinema.com)',
      );
    }
  });

  it('rejects latitude without longitude', () => {
    const result = clientCreateTheatreSchema.safeParse({
      ...validMinimalExistingCity,
      latitude: '12.9352',
      longitude: '',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const latIssue = result.error.issues.find((i) => i.path.includes('latitude'));
      expect(latIssue?.message).toBe(
        'Latitude and longitude must both be provided together, or both omitted.',
      );
    }
  });

  it('rejects longitude without latitude', () => {
    const result = clientCreateTheatreSchema.safeParse({
      ...validMinimalExistingCity,
      latitude: '',
      longitude: '77.6245',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const latIssue = result.error.issues.find((i) => i.path.includes('latitude'));
      expect(latIssue?.message).toBe(
        'Latitude and longitude must both be provided together, or both omitted.',
      );
    }
  });

  it('rejects form when neither cityId nor complete city details are provided', () => {
    const result = clientCreateTheatreSchema.safeParse({
      ...validMinimalExistingCity,
      cityId: '',
      cityName: 'Mumbai',
      state: '', // missing state
      country: 'India',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const cityIssue = result.error.issues.find((i) => i.path.includes('cityName'));
      expect(cityIssue?.message).toBe(
        'Select an existing city or provide City Name, State, and Country.',
      );
    }
  });

  it('rejects out-of-range coordinates', () => {
    const resultLat = clientCreateTheatreSchema.safeParse({
      ...validMinimalExistingCity,
      latitude: '95', // > 90
      longitude: '77.6245',
    });
    expect(resultLat.success).toBe(false);
    if (!resultLat.success) {
      const messages = resultLat.error.issues.map((i) => i.message);
      expect(messages).toContain('Latitude must be a number between -90 and 90');
    }

    const resultLng = clientCreateTheatreSchema.safeParse({
      ...validMinimalExistingCity,
      latitude: '12.9352',
      longitude: '190', // > 180
    });
    expect(resultLng.success).toBe(false);
    if (!resultLng.success) {
      const messages = resultLng.error.issues.map((i) => i.message);
      expect(messages).toContain('Longitude must be a number between -180 and 180');
    }
  });
});

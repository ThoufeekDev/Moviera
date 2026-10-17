import { describe, it, expect } from 'vitest';
import { buildCreateTheatrePayload } from '../buildCreateTheatrePayload';
import { defaultCreateTheatreFormValues } from '../../schemas/createTheatreForm.schema';

describe('buildCreateTheatrePayload', () => {
  const baseValues = {
    ...defaultCreateTheatreFormValues,
    name: 'PVR Forum',
    address: '21 Hosur Road',
  };

  it('includes cityId and leaves cityName/state/country undefined when cityId is set', () => {
    const payload = buildCreateTheatrePayload(
      {
        ...baseValues,
        cityId: 'city-123',
        cityName: 'Bengaluru',
        state: 'Karnataka',
        country: 'India',
      },
      { logoFile: null, locationMode: 'manual' },
    );

    expect(payload.cityId).toBe('city-123');
    expect(payload.cityName).toBeUndefined();
    expect(payload.state).toBeUndefined();
    expect(payload.country).toBeUndefined();
  });

  it('includes cityName, state, and country when cityId is not set', () => {
    const payload = buildCreateTheatrePayload(
      {
        ...baseValues,
        cityId: '',
        cityName: 'Bengaluru',
        state: 'Karnataka',
        country: 'India',
      },
      { logoFile: null, locationMode: 'manual' },
    );

    expect(payload.cityId).toBeUndefined();
    expect(payload.cityName).toBe('Bengaluru');
    expect(payload.state).toBe('Karnataka');
    expect(payload.country).toBe('India');
  });

  it('returns null for both latitude and longitude when only latitude is provided', () => {
    const payload = buildCreateTheatrePayload(
      {
        ...baseValues,
        cityId: 'city-123',
        latitude: '12.9352',
        longitude: '',
      },
      { logoFile: null, locationMode: 'manual' },
    );

    expect(payload.latitude).toBeNull();
    expect(payload.longitude).toBeNull();
  });

  it('returns null for both latitude and longitude when only longitude is provided', () => {
    const payload = buildCreateTheatrePayload(
      {
        ...baseValues,
        cityId: 'city-123',
        latitude: '',
        longitude: '77.6245',
      },
      { logoFile: null, locationMode: 'manual' },
    );

    expect(payload.latitude).toBeNull();
    expect(payload.longitude).toBeNull();
  });

  it('returns parsed numbers for latitude and longitude when both are provided', () => {
    const payload = buildCreateTheatrePayload(
      {
        ...baseValues,
        cityId: 'city-123',
        latitude: '12.9352',
        longitude: '77.6245',
      },
      { logoFile: null, locationMode: 'manual' },
    );

    expect(payload.latitude).toBe(12.9352);
    expect(payload.longitude).toBe(77.6245);
  });

  it('converts empty strings to undefined for optional fields', () => {
    const payload = buildCreateTheatrePayload(
      {
        ...baseValues,
        cityId: 'city-123',
        description: '   ',
        phone: '',
        pincode: ' ',
        landmark: '',
        licenseNumber: '   ',
        areaName: '',
        district: ' ',
      },
      { logoFile: null, locationMode: 'manual' },
    );

    expect(payload.description).toBeUndefined();
    expect(payload.phone).toBeUndefined();
    expect(payload.pincode).toBeUndefined();
    expect(payload.landmark).toBeUndefined();
    expect(payload.licenseNumber).toBeUndefined();
    expect(payload.areaName).toBeUndefined();
    expect(payload.district).toBeUndefined();
  });

  it('trims and lowercases the email', () => {
    const payload = buildCreateTheatrePayload(
      {
        ...baseValues,
        cityId: 'city-123',
        email: '  Help@PVRcinemas.COM  ',
      },
      { logoFile: null, locationMode: 'manual' },
    );

    expect(payload.email).toBe('help@pvrcinemas.com');
  });

  it('includes googlePlaceId only when locationMode is google', () => {
    const inGoogleMode = buildCreateTheatrePayload(
      {
        ...baseValues,
        cityId: 'city-123',
        googlePlaceId: 'ChIJ12345',
      },
      { logoFile: null, locationMode: 'google' },
    );
    expect(inGoogleMode.googlePlaceId).toBe('ChIJ12345');

    const inManualMode = buildCreateTheatrePayload(
      {
        ...baseValues,
        cityId: 'city-123',
        googlePlaceId: 'ChIJ12345',
      },
      { logoFile: null, locationMode: 'manual' },
    );
    expect(inManualMode.googlePlaceId).toBeUndefined();
  });

  it('passes logo file through to payload', () => {
    const mockFile = new File(['dummy'], 'logo.png', { type: 'image/png' });
    const payload = buildCreateTheatrePayload(
      {
        ...baseValues,
        cityId: 'city-123',
      },
      { logoFile: mockFile, locationMode: 'manual' },
    );

    expect(payload.logo).toBe(mockFile);
  });
});

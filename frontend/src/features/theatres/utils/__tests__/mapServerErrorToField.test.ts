import { describe, it, expect } from 'vitest';
import { mapServerErrorToField } from '../mapServerErrorToField';
import { ApiError } from '@/shared/lib/ApiError';

describe('mapServerErrorToField', () => {
  it('maps name error to name field', () => {
    const error = new Error('Theatre name already exists in this city');
    const result = mapServerErrorToField(error, { cityId: 'c1' });
    expect(result).toEqual({
      field: 'name',
      message: 'Theatre name already exists in this city',
    });
  });

  it('maps licence message to licenseNumber field', () => {
    const error = new Error('Invalid licence number format');
    const result = mapServerErrorToField(error, { cityId: 'c1' });
    expect(result).toEqual({
      field: 'licenseNumber',
      message: 'Invalid licence number format',
    });
  });

  it('maps license message (US spelling) to licenseNumber field', () => {
    const error = new Error('Duplicate license code');
    const result = mapServerErrorToField(error, { cityId: 'c1' });
    expect(result).toEqual({
      field: 'licenseNumber',
      message: 'Duplicate license code',
    });
  });

  it('maps city message to cityId when cityId is present in values', () => {
    const error = new ApiError('Selected city is currently inactive', 400);
    const result = mapServerErrorToField(error, { cityId: 'c1' });
    expect(result).toEqual({
      field: 'cityId',
      message: 'Selected city is currently inactive',
    });
  });

  it('maps city message to cityName when cityId is empty', () => {
    const error = new ApiError('City not found or invalid', 400);
    const result = mapServerErrorToField(error, { cityId: '' });
    expect(result).toEqual({
      field: 'cityName',
      message: 'City not found or invalid',
    });
  });

  it('falls back to serverError when message does not match known field patterns', () => {
    const error = new Error('Internal database connection failed');
    const result = mapServerErrorToField(error, { cityId: 'c1' });
    expect(result).toEqual({
      serverError: 'Internal database connection failed',
    });
  });

  it('handles string errors and unknown error formats gracefully', () => {
    const resultStr = mapServerErrorToField('Something unexpected', { cityId: '' });
    expect(resultStr).toEqual({
      serverError: 'Something unexpected',
    });

    const resultUnknown = mapServerErrorToField({ foo: 'bar' }, { cityId: '' });
    expect(resultUnknown).toEqual({
      serverError: 'Failed to create theatre. Please check the inputs and try again.',
    });
  });
});

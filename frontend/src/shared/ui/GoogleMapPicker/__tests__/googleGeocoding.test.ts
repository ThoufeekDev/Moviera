import { describe, it, expect } from 'vitest';
import { extractPlaceDetailsFromGeocoderResults } from '../googleGeocoding';
import type { GoogleGeocoderResult } from '../googleMap.types';

describe('extractPlaceDetailsFromGeocoderResults', () => {
  it('returns fallback coords and empty address when results are empty', () => {
    const details = extractPlaceDetailsFromGeocoderResults([], { lat: 12.9352, lng: 77.6245 });
    expect(details.latitude).toBe(12.9352);
    expect(details.longitude).toBe(77.6245);
    expect(details.address).toBe('');
    expect(details.googlePlaceId).toBe('');
  });

  it('extracts all address components from a complete geocoder result', () => {
    const mockResults: GoogleGeocoderResult[] = [
      {
        place_id: 'ChIJbU60qdsWrjsR4qnUz2XumLA',
        formatted_address: 'Forum Mall, 21 Hosur Rd, Koramangala, Bengaluru, Karnataka 560095, India',
        geometry: {
          location: {
            lat: () => 12.9352,
            lng: () => 77.6245,
          },
        },
        address_components: [
          { long_name: 'Forum Mall', short_name: 'Forum Mall', types: ['point_of_interest'] },
          { long_name: 'Koramangala', short_name: 'Koramangala', types: ['sublocality_level_1'] },
          { long_name: 'Bengaluru', short_name: 'Bengaluru', types: ['locality'] },
          { long_name: 'Bengaluru Urban', short_name: 'Bengaluru Urban', types: ['administrative_area_level_2'] },
          { long_name: 'Karnataka', short_name: 'KA', types: ['administrative_area_level_1'] },
          { long_name: 'India', short_name: 'IN', types: ['country'] },
          { long_name: '560 095', short_name: '560095', types: ['postal_code'] },
        ],
      },
    ];

    const details = extractPlaceDetailsFromGeocoderResults(mockResults);

    expect(details.googlePlaceId).toBe('ChIJbU60qdsWrjsR4qnUz2XumLA');
    expect(details.address).toBe('Forum Mall, 21 Hosur Rd, Koramangala, Bengaluru, Karnataka 560095, India');
    expect(details.name).toBe('Forum Mall');
    expect(details.cityName).toBe('Bengaluru');
    expect(details.areaName).toBe('Koramangala');
    expect(details.district).toBe('Bengaluru Urban');
    expect(details.state).toBe('Karnataka');
    expect(details.country).toBe('India');
    expect(details.pincode).toBe('560095');
    expect(details.latitude).toBe(12.9352);
    expect(details.longitude).toBe(77.6245);
  });

  it('scans secondary results when primary result is missing district or pincode', () => {
    const mockResults: GoogleGeocoderResult[] = [
      {
        place_id: 'premise-id-1',
        formatted_address: 'Screen 1, Theatre Complex, Indiranagar',
        geometry: {
          location: {
            lat: () => 12.9716,
            lng: () => 77.5946,
          },
        },
        address_components: [
          { long_name: 'Indiranagar', short_name: 'Indiranagar', types: ['sublocality_level_1'] },
        ],
      },
      {
        place_id: 'sublocality-id-2',
        formatted_address: 'Indiranagar, Bengaluru, Karnataka 560038',
        geometry: {
          location: {
            lat: () => 12.9716,
            lng: () => 77.5946,
          },
        },
        address_components: [
          { long_name: 'Bengaluru', short_name: 'Bengaluru', types: ['locality'] },
          { long_name: 'Bengaluru Urban', short_name: 'Bengaluru Urban', types: ['administrative_area_level_2'] },
          { long_name: 'Karnataka', short_name: 'Karnataka', types: ['administrative_area_level_1'] },
          { long_name: 'India', short_name: 'India', types: ['country'] },
          { long_name: '560038', short_name: '560038', types: ['postal_code'] },
        ],
      },
    ];

    const details = extractPlaceDetailsFromGeocoderResults(mockResults);

    expect(details.areaName).toBe('Indiranagar');
    expect(details.cityName).toBe('Bengaluru');
    expect(details.district).toBe('Bengaluru Urban');
    expect(details.state).toBe('Karnataka');
    expect(details.country).toBe('India');
    expect(details.pincode).toBe('560038');
    expect(details.latitude).toBe(12.9716);
    expect(details.longitude).toBe(77.5946);
  });
});

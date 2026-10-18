import { describe, it, expect } from 'vitest';
import { placeToExtractedDetails } from '../placeToExtractedDetails';
import type { PlaceInstance } from '../googleMap.types';

describe('placeToExtractedDetails', () => {
  it('maps a full India address correctly', () => {
    const mockPlace: PlaceInstance = {
      id: 'place_id_123',
      displayName: 'PVR Nexus Mall',
      formattedAddress: 'Nexus Mall, Koramangala, Bengaluru, Karnataka 560095, India',
      location: {
        lat: () => 12.9352,
        lng: () => 77.6245,
      },
      addressComponents: [
        { longText: 'PVR Nexus Mall', shortText: 'PVR', types: ['point_of_interest'] },
        { longText: 'Koramangala', shortText: 'Koramangala', types: ['sublocality_level_1'] },
        { longText: 'Bengaluru', shortText: 'Bengaluru', types: ['locality'] },
        { longText: 'Bengaluru Urban', shortText: 'Bengaluru Urban', types: ['administrative_area_level_2'] },
        { longText: 'Karnataka', shortText: 'KA', types: ['administrative_area_level_1'] },
        { longText: 'India', shortText: 'IN', types: ['country'] },
        { longText: '560 095', shortText: '560095', types: ['postal_code'] },
      ],
      fetchFields: async () => {},
    };

    const result = placeToExtractedDetails(mockPlace);

    expect(result.googlePlaceId).toBe('place_id_123');
    expect(result.name).toBe('PVR Nexus Mall');
    expect(result.address).toBe('Nexus Mall, Koramangala, Bengaluru, Karnataka 560095, India');
    expect(result.cityName).toBe('Bengaluru');
    expect(result.areaName).toBe('Koramangala');
    expect(result.district).toBe('Bengaluru Urban');
    expect(result.state).toBe('Karnataka');
    expect(result.country).toBe('India');
    expect(result.pincode).toBe('560095');
    expect(result.latitude).toBe(12.9352);
    expect(result.longitude).toBe(77.6245);
  });

  it('falls back to sublocality or district when locality is missing', () => {
    const mockPlace: PlaceInstance = {
      id: 'place_no_locality',
      displayName: { text: 'Suburban Multiplex' },
      formattedAddress: 'Sublocality Area, Ernakulam, Kerala 682001, India',
      location: {
        lat: 9.9816,
        lng: 76.2999,
      },
      addressComponents: [
        { longText: 'Sublocality Area', shortText: 'Sublocality Area', types: ['sublocality_level_1'] },
        { longText: 'Ernakulam', shortText: 'Ernakulam', types: ['administrative_area_level_2'] },
        { longText: 'Kerala', shortText: 'KL', types: ['administrative_area_level_1'] },
        { longText: 'India', shortText: 'IN', types: ['country'] },
        { longText: '682001', shortText: '682001', types: ['postal_code'] },
      ],
      fetchFields: async () => {},
    };

    const result = placeToExtractedDetails(mockPlace);

    expect(result.name).toBe('Suburban Multiplex');
    expect(result.cityName).toBe('Sublocality Area');
    expect(result.areaName).toBe('Sublocality Area');
    expect(result.district).toBe('Ernakulam');
    expect(result.state).toBe('Kerala');
    expect(result.country).toBe('India');
    expect(result.latitude).toBe(9.9816);
    expect(result.longitude).toBe(76.2999);
  });

  it('falls back to administrative_area_level_3 when level 2 district is missing', () => {
    const mockPlace: PlaceInstance = {
      id: 'place_no_level2',
      displayName: 'Town Cinema',
      formattedAddress: 'Town Cinema, Taluk Region, State, India',
      addressComponents: [
        { longText: 'Taluk Region', shortText: 'Taluk Region', types: ['administrative_area_level_3'] },
        { longText: 'State Name', shortText: 'SN', types: ['administrative_area_level_1'] },
        { longText: 'India', shortText: 'IN', types: ['country'] },
      ],
      fetchFields: async () => {},
    };

    const result = placeToExtractedDetails(mockPlace);

    expect(result.district).toBe('Taluk Region');
    expect(result.state).toBe('State Name');
    expect(result.country).toBe('India');
  });

  it('handles missing postal code without error', () => {
    const mockPlace: PlaceInstance = {
      id: 'place_no_pin',
      displayName: 'Rural Drive-in',
      formattedAddress: 'Highway Road, India',
      addressComponents: [
        { longText: 'India', shortText: 'IN', types: ['country'] },
      ],
      fetchFields: async () => {},
    };

    const result = placeToExtractedDetails(mockPlace);

    expect(result.pincode).toBeUndefined();
    expect(result.country).toBe('India');
  });
});

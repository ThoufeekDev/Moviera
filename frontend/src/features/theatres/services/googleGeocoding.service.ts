import type {
  GoogleGeocoderResult,
  GoogleMapsScriptWindow,
  GoogleGeocoderStatus,
} from '../types/googleMap.types';
import type { ExtractedPlaceDetails } from './googlePlaces.service';
import { loadGoogleMapsSdk } from './googleMapsLoader.service';

/**
 * Extracts normalized theatre location fields from Google Geocoder results.
 * Scans primary result and supplements any missing administrative units from secondary results.
 */
export function extractPlaceDetailsFromGeocoderResults(
  results: GoogleGeocoderResult[],
  fallbackCoords?: { lat: number; lng: number },
): ExtractedPlaceDetails {
  if (!results || results.length === 0) {
    return {
      googlePlaceId: '',
      address: '',
      latitude: fallbackCoords?.lat,
      longitude: fallbackCoords?.lng,
    };
  }

  const primary = results[0];
  let extractedLat = fallbackCoords?.lat;
  let extractedLng = fallbackCoords?.lng;

  if (primary.geometry?.location) {
    const loc = primary.geometry.location;
    if (typeof loc.lat === 'function' && typeof loc.lng === 'function') {
      extractedLat = loc.lat();
      extractedLng = loc.lng();
    } else if (typeof loc.lat === 'number' && typeof loc.lng === 'number') {
      extractedLat = loc.lat;
      extractedLng = loc.lng;
    }
  }

  const details: ExtractedPlaceDetails = {
    googlePlaceId: primary.place_id || '',
    address: primary.formatted_address || '',
    latitude: extractedLat,
    longitude: extractedLng,
  };

  let locality: string | undefined;
  let postalTown: string | undefined;
  let sublocality1: string | undefined;
  let sublocality: string | undefined;
  let neighborhood: string | undefined;
  let adminAreaLevel3: string | undefined;
  let adminAreaLevel2: string | undefined;
  let adminAreaLevel1: string | undefined;
  let country: string | undefined;
  let postalCode: string | undefined;
  let pointOfInterest: string | undefined;
  let premise: string | undefined;

  // Scan across results (from most specific to broader) to ensure complete address capture
  for (const res of results) {
    const components = res.address_components || [];
    for (const comp of components) {
      const types = comp.types || [];
      const text = comp.long_name || comp.short_name || '';

      if (!locality && types.includes('locality')) locality = text;
      if (!postalTown && types.includes('postal_town')) postalTown = text;
      if (!sublocality1 && types.includes('sublocality_level_1')) sublocality1 = text;
      if (!sublocality && types.includes('sublocality')) sublocality = text;
      if (!neighborhood && types.includes('neighborhood')) neighborhood = text;
      if (!adminAreaLevel3 && types.includes('administrative_area_level_3')) adminAreaLevel3 = text;
      if (!adminAreaLevel2 && types.includes('administrative_area_level_2')) adminAreaLevel2 = text;
      if (!adminAreaLevel1 && types.includes('administrative_area_level_1')) adminAreaLevel1 = text;
      if (!country && types.includes('country')) country = text;
      if (!postalCode && types.includes('postal_code')) postalCode = text;
      if (!pointOfInterest && types.includes('point_of_interest')) pointOfInterest = text;
      if (!premise && types.includes('premise')) premise = text;
    }
  }

  details.name = pointOfInterest || premise || undefined;
  details.cityName = locality || postalTown || adminAreaLevel3 || adminAreaLevel2 || undefined;
  details.areaName = sublocality1 || sublocality || neighborhood || undefined;
  details.district = adminAreaLevel2 || adminAreaLevel3 || undefined;
  details.state = adminAreaLevel1 || undefined;
  details.country = country || undefined;

  if (postalCode) {
    details.pincode = postalCode.replace(/\s+/g, '');
  }

  return details;
}

/**
 * Reverse geocodes a geographic coordinate (lat, lng) to obtain comprehensive address components.
 */
export async function reverseGeocodeCoordinate(
  lat: number,
  lng: number,
  apiKey: string,
): Promise<ExtractedPlaceDetails> {
  await loadGoogleMapsSdk(apiKey);

  const win = window as GoogleMapsScriptWindow;
  if (!win.google?.maps?.Geocoder) {
    throw new Error('Google Maps Geocoder is unavailable.');
  }

  const geocoder = new win.google.maps.Geocoder();

  return new Promise<ExtractedPlaceDetails>((resolve, reject) => {
    geocoder.geocode({ location: { lat, lng } }, (results, status: GoogleGeocoderStatus) => {
      if (status === 'OK' && results && results.length > 0) {
        const extracted = extractPlaceDetailsFromGeocoderResults(results, { lat, lng });
        resolve(extracted);
      } else if (status === 'ZERO_RESULTS') {
        resolve({
          googlePlaceId: '',
          address: `Pinned Location (${lat.toFixed(5)}, ${lng.toFixed(5)})`,
          latitude: lat,
          longitude: lng,
        });
      } else {
        reject(new Error(`Reverse geocoding failed with status: ${status}`));
      }
    });
  });
}

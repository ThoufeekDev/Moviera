import type { PlaceInstance, ExtractedLocationDetails } from './googleMap.types';
import { normalizeMarkerPosition } from './normalizeMarkerPosition';

/**
 * Maps modern Google Maps JS SDK Place object to ExtractedLocationDetails.
 * Pure function with robust fallback rules matching the application address model.
 */
export function placeToExtractedDetails(place: PlaceInstance): ExtractedLocationDetails {
  const normLocation = normalizeMarkerPosition(place.location);
  const name =
    typeof place.displayName === 'string'
      ? place.displayName
      : place.displayName?.text || undefined;

  const result: ExtractedLocationDetails = {
    googlePlaceId: place.id || '',
    name,
    address: place.formattedAddress || '',
    latitude: normLocation?.lat,
    longitude: normLocation?.lng,
  };

  const components = place.addressComponents || [];
  let locality: string | undefined;
  let postalTown: string | undefined;
  let sublocality1: string | undefined;
  let sublocalityFallback: string | undefined;
  let neighborhood: string | undefined;
  let adminAreaLevel3: string | undefined;
  let adminAreaLevel2: string | undefined;
  let adminAreaLevel1: string | undefined;
  let country: string | undefined;
  let postalCode: string | undefined;

  for (const comp of components) {
    const types = comp.types || [];
    const text = comp.longText || comp.shortText || '';
    if (!text) continue;

    if (types.includes('locality')) {
      locality = text;
    } else if (types.includes('postal_town')) {
      postalTown = text;
    } else if (types.includes('sublocality_level_1')) {
      sublocality1 = text;
    } else if (types.includes('sublocality')) {
      sublocalityFallback = text;
    } else if (types.includes('neighborhood')) {
      neighborhood = text;
    } else if (types.includes('administrative_area_level_3')) {
      adminAreaLevel3 = text;
    } else if (types.includes('administrative_area_level_2')) {
      adminAreaLevel2 = text;
    } else if (types.includes('administrative_area_level_1')) {
      adminAreaLevel1 = text;
    } else if (types.includes('country')) {
      country = text;
    } else if (types.includes('postal_code')) {
      postalCode = text;
    }
  }

  // 1. Locality or postal_town to cityName (fall back to a sublocality or district only if no locality exists)
  result.cityName =
    locality ||
    postalTown ||
    sublocality1 ||
    sublocalityFallback ||
    adminAreaLevel2 ||
    undefined;

  // 2. Sublocality_level_1 or neighborhood to areaName
  result.areaName = sublocality1 || neighborhood || undefined;

  // 3. Administrative_area_level_2 to district (fall back to administrative_area_level_3 when level 2 is empty)
  result.district = adminAreaLevel2 || adminAreaLevel3 || undefined;

  // 4. Administrative_area_level_1 to state
  result.state = adminAreaLevel1 || undefined;

  // 5. Country
  result.country = country || undefined;

  // 6. Postal_code to pincode (whitespace stripped)
  if (postalCode) {
    result.pincode = postalCode.replace(/\s+/g, '');
  }

  return result;
}

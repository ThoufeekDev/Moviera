import type {
  GooglePlacePrediction,
  ExtractedLocationDetails,
  GoogleMapsScriptWindow,
  GooglePlacesService,
  GoogleAutocompleteService,
} from './googleMap.types';
import { loadGoogleMapsSdk } from './googleMapsLoader';

let currentSessionToken: string | null = null;

export function getOrCreateSessionToken(): string {
  if (!currentSessionToken) {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      currentSessionToken = crypto.randomUUID();
    } else {
      currentSessionToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
  }
  return currentSessionToken;
}

export function resetSessionToken(): void {
  currentSessionToken = null;
}

interface NewPlacesPredictionItem {
  placePrediction?: {
    place?: string;
    placeId?: string;
    text?: { text?: string };
    structuredFormat?: {
      mainText?: { text?: string };
      secondaryText?: { text?: string };
    };
  };
}

interface NewPlacesAutocompleteResponse {
  suggestions?: NewPlacesPredictionItem[];
  error?: {
    code?: number;
    message?: string;
    status?: string;
    details?: Array<{ reason?: string; message?: string }>;
  };
}

interface NewPlaceDetailsResponse {
  id?: string;
  formattedAddress?: string;
  displayName?: {
    text?: string;
    languageCode?: string;
  };
  location?: {
    latitude?: number;
    longitude?: number;
  };
  addressComponents?: Array<{
    longText?: string;
    shortText?: string;
    types?: string[];
  }>;
  error?: {
    code?: number;
    message?: string;
    status?: string;
    details?: Array<{ reason?: string; message?: string }>;
  };
}

let placesServiceInstance: GooglePlacesService | null = null;
let autocompleteServiceInstance: GoogleAutocompleteService | null = null;

export async function fetchPlacePredictions(
  query: string,
  apiKey: string,
): Promise<GooglePlacePrediction[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  if (!apiKey || apiKey.trim() === '') {
    throw new Error('Google Places API key is missing.');
  }

  const sessionToken = getOrCreateSessionToken();

  try {
    const response = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey.trim(),
      },
      body: JSON.stringify({
        input: trimmed,
        sessionToken,
      }),
    });

    const data = (await response.json()) as NewPlacesAutocompleteResponse;

    if (!response.ok || data.error) {
      const errMsg = data.error?.message || response.statusText;
      throw new Error(`Google Places error: ${errMsg}`);
    }

    const suggestions = data.suggestions || [];
    return suggestions
      .filter((s) => s.placePrediction?.placeId)
      .map((s) => {
        const pred = s.placePrediction!;
        const rawPlaceId = pred.placeId || pred.place?.replace('places/', '') || '';
        const mainText = pred.structuredFormat?.mainText?.text || pred.text?.text || '';
        const secondaryText = pred.structuredFormat?.secondaryText?.text;
        const description = pred.text?.text || mainText;

        return {
          placeId: rawPlaceId,
          description,
          mainText,
          secondaryText,
        };
      });
  } catch (err: unknown) {
    if (err instanceof Error && (err.message.includes('Google Cloud') || err.message.includes('API error'))) {
      throw err;
    }

    try {
      return await fetchPlacePredictionsFromJsSdk(trimmed, apiKey);
    } catch {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error('Unable to search Google Places. Please verify your connection.');
    }
  }
}

export async function fetchPlaceDetails(
  placeId: string,
  apiKey: string,
): Promise<ExtractedLocationDetails> {
  if (!placeId) {
    throw new Error('Valid Google Place ID is required.');
  }

  if (!apiKey || apiKey.trim() === '') {
    throw new Error('Google Places API key is missing.');
  }

  const sessionToken = getOrCreateSessionToken();

  try {
    const cleanId = placeId.startsWith('places/') ? placeId.replace('places/', '') : placeId;
    const url = new URL(`https://places.googleapis.com/v1/places/${encodeURIComponent(cleanId)}`);
    if (sessionToken) {
      url.searchParams.set('sessionToken', sessionToken);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'X-Goog-Api-Key': apiKey.trim(),
        'X-Goog-FieldMask': 'id,displayName,formattedAddress,addressComponents,location',
      },
    });

    const data = (await response.json()) as NewPlaceDetailsResponse;

    if (!response.ok || data.error) {
      const errMsg = data.error?.message || response.statusText;
      throw new Error(`Google Place details error: ${errMsg}`);
    }

    resetSessionToken();
    return extractNewPlaceDetails(data);
  } catch (err: unknown) {
    try {
      const legacyDetails = await fetchPlaceDetailsFromJsSdk(placeId, apiKey);
      resetSessionToken();
      return legacyDetails;
    } catch {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error('Failed to retrieve place details from Google Places.');
    }
  }
}

function extractNewPlaceDetails(data: NewPlaceDetailsResponse): ExtractedLocationDetails {
  const result: ExtractedLocationDetails = {
    googlePlaceId: data.id || '',
    name: data.displayName?.text || undefined,
    address: data.formattedAddress || '',
  };

  if (data.location?.latitude !== undefined && data.location?.longitude !== undefined) {
    result.latitude = data.location.latitude;
    result.longitude = data.location.longitude;
  }

  const components = data.addressComponents || [];
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

  for (const comp of components) {
    const types = comp.types || [];
    const text = comp.longText || comp.shortText || '';

    if (types.includes('locality')) locality = text;
    else if (types.includes('postal_town')) postalTown = text;
    else if (types.includes('sublocality_level_1')) sublocality1 = text;
    else if (types.includes('sublocality')) sublocality = text;
    else if (types.includes('neighborhood')) neighborhood = text;
    else if (types.includes('administrative_area_level_3')) adminAreaLevel3 = text;
    else if (types.includes('administrative_area_level_2')) adminAreaLevel2 = text;
    else if (types.includes('administrative_area_level_1')) adminAreaLevel1 = text;
    else if (types.includes('country')) country = text;
    else if (types.includes('postal_code')) postalCode = text;
  }

  result.cityName = locality || postalTown || adminAreaLevel3 || adminAreaLevel2 || undefined;
  result.areaName = sublocality1 || sublocality || neighborhood || undefined;
  result.district = adminAreaLevel2 || adminAreaLevel3 || undefined;
  result.state = adminAreaLevel1 || undefined;
  result.country = country || undefined;

  if (postalCode) {
    result.pincode = postalCode.replace(/\s+/g, '');
  }

  return result;
}

async function fetchPlacePredictionsFromJsSdk(
  query: string,
  apiKey: string,
): Promise<GooglePlacePrediction[]> {
  await loadGoogleMapsSdk(apiKey);

  const win = window as GoogleMapsScriptWindow;
  if (!win.google?.maps?.places) {
    throw new Error('Google Maps Places library is unavailable.');
  }

  if (!autocompleteServiceInstance) {
    autocompleteServiceInstance = new win.google.maps.places.AutocompleteService();
  }

  return new Promise<GooglePlacePrediction[]>((resolve, reject) => {
    autocompleteServiceInstance?.getPlacePredictions(
      { input: query },
      (predictions, status) => {
        const statuses = win.google?.maps?.places?.PlacesServiceStatus;

        if (status === statuses?.OK && predictions) {
          resolve(
            predictions.map((p) => ({
              placeId: p.place_id,
              description: p.description,
              mainText: p.structured_formatting?.main_text || p.description,
              secondaryText: p.structured_formatting?.secondary_text,
            })),
          );
        } else if (status === statuses?.ZERO_RESULTS || !predictions) {
          resolve([]);
        } else {
          reject(new Error(`Places autocomplete failed: ${status}`));
        }
      },
    );
  });
}

async function fetchPlaceDetailsFromJsSdk(
  placeId: string,
  apiKey: string,
): Promise<ExtractedLocationDetails> {
  await loadGoogleMapsSdk(apiKey);

  const win = window as GoogleMapsScriptWindow;
  if (!win.google?.maps?.places) {
    throw new Error('Google Maps Places library is unavailable.');
  }

  if (!placesServiceInstance) {
    const dummyDiv = document.createElement('div');
    placesServiceInstance = new win.google.maps.places.PlacesService(dummyDiv);
  }

  return new Promise<ExtractedLocationDetails>((resolve, reject) => {
    placesServiceInstance?.getDetails(
      {
        placeId,
        fields: ['place_id', 'formatted_address', 'address_components', 'geometry', 'name'],
      },
      (place, status) => {
        const statuses = win.google?.maps?.places?.PlacesServiceStatus;

        if (status !== statuses?.OK || !place) {
          reject(new Error(`Failed to fetch place details: ${status}`));
          return;
        }

        const result: ExtractedLocationDetails = {
          googlePlaceId: place.place_id || '',
          name: place.name || undefined,
          address: place.formatted_address || '',
        };

        if (place.geometry?.location) {
          result.latitude = place.geometry.location.lat();
          result.longitude = place.geometry.location.lng();
        }

        const components = place.address_components || [];
        let locality: string | undefined;
        let postalTown: string | undefined;
        let sublocality1: string | undefined;
        let sublocality: string | undefined;
        let neighborhood: string | undefined;
        let adminAreaLevel2: string | undefined;
        let adminAreaLevel1: string | undefined;
        let country: string | undefined;
        let postalCode: string | undefined;

        for (const comp of components) {
          const types = comp.types;
          if (types.includes('locality')) locality = comp.long_name;
          else if (types.includes('postal_town')) postalTown = comp.long_name;
          else if (types.includes('sublocality_level_1')) sublocality1 = comp.long_name;
          else if (types.includes('sublocality')) sublocality = comp.long_name;
          else if (types.includes('neighborhood')) neighborhood = comp.long_name;
          else if (types.includes('administrative_area_level_2')) adminAreaLevel2 = comp.long_name;
          else if (types.includes('administrative_area_level_1')) adminAreaLevel1 = comp.long_name;
          else if (types.includes('country')) country = comp.long_name;
          else if (types.includes('postal_code')) postalCode = comp.long_name;
        }

        result.cityName = locality || postalTown || adminAreaLevel2 || undefined;
        result.areaName = sublocality1 || sublocality || neighborhood || undefined;
        result.district = adminAreaLevel2 || undefined;
        result.state = adminAreaLevel1 || undefined;
        result.country = country || undefined;
        if (postalCode) result.pincode = postalCode.replace(/\s+/g, '');

        resolve(result);
      },
    );
  });
}

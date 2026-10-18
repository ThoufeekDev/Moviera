import { loadGoogleMapsSdk } from './googleMapsLoader.service';

export interface GooglePlacePrediction {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText?: string;
}

export interface ExtractedPlaceDetails {
  googlePlaceId: string;
  name?: string;
  address: string;
  cityName?: string;
  areaName?: string;
  district?: string;
  state?: string;
  country?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
}

// Session token for Google Places Autocomplete billing grouping
let currentSessionToken: string | null = null;

function getOrCreateSessionToken(): string {
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

/**
 * Searches for places matching a search query.
 * Primarily uses Google Places API (New) with CORS support, falling back to Google Maps JS SDK if needed.
 */
export async function fetchPlacePredictions(
  query: string,
  apiKey: string,
): Promise<GooglePlacePrediction[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  if (!apiKey || apiKey.trim() === '') {
    throw new Error(
      'Google Places API key is missing. Please set VITE_GOOGLE_MAPS_API_KEY in your environment configuration.',
    );
  }

  const sessionToken = getOrCreateSessionToken();

  try {
    // 1. Try modern Places API (New)
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
      const errReason = data.error?.details?.[0]?.reason || data.error?.status;
      const errMsg = data.error?.message || response.statusText;

      if (errReason === 'API_KEY_HTTP_REFERRER_BLOCKED') {
        throw new Error(
          'Requests from this origin are blocked by Google Cloud HTTP referrer restrictions. Please add your local dev URL (e.g. http://localhost:5173/*) to allowed website referrers in Google Cloud Console.',
        );
      }

      if (
        errMsg?.includes('LegacyApiNotActivatedMapError') ||
        errMsg?.includes('not enabled') ||
        response.status === 403
      ) {
        throw new Error(
          `Google Places API error (${response.status}): ${errMsg}. Ensure "Places API (New)" is enabled and billing is active.`,
        );
      }

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
    // If Places API (New) threw an explicit configuration error, bubble it up
    if (err instanceof Error && (err.message.includes('Google Cloud') || err.message.includes('API error'))) {
      throw err;
    }

    // Try fallback to Google Maps JS SDK for projects on legacy setup
    try {
      return await fetchPlacePredictionsFromJsSdk(trimmed, apiKey);
    } catch {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error('Unable to search Google Places. Please verify your connection or switch to manual entry.');
    }
  }
}

/**
 * Fetches place details and extracts normalized location components.
 */
export async function fetchPlaceDetails(
  placeId: string,
  apiKey: string,
): Promise<ExtractedPlaceDetails> {
  if (!placeId) {
    throw new Error('Valid Google Place ID is required.');
  }

  if (!apiKey || apiKey.trim() === '') {
    throw new Error('Google Places API key is missing.');
  }

  const sessionToken = getOrCreateSessionToken();

  try {
    // 1. Try modern Places API (New) details endpoint
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

    // Reset session token after successful detail retrieval
    resetSessionToken();

    return extractNewPlaceDetails(data);
  } catch (err: unknown) {
    // Try fallback to Google Maps JS SDK
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

/**
 * Normalizes details returned by Places API (New) without fabricating missing components.
 */
function extractNewPlaceDetails(data: NewPlaceDetailsResponse): ExtractedPlaceDetails {
  const result: ExtractedPlaceDetails = {
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

    if (types.includes('locality')) {
      locality = text;
    } else if (types.includes('postal_town')) {
      postalTown = text;
    } else if (types.includes('sublocality_level_1')) {
      sublocality1 = text;
    } else if (types.includes('sublocality')) {
      sublocality = text;
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

  // City: locality preferred, fallback to postal_town, then adminAreaLevel3/2
  result.cityName = locality || postalTown || adminAreaLevel3 || adminAreaLevel2 || undefined;
  result.areaName = sublocality1 || sublocality || neighborhood || undefined;
  result.district = adminAreaLevel2 || adminAreaLevel3 || undefined;
  result.state = adminAreaLevel1 || undefined;
  result.country = country || undefined;

  if (postalCode) {
    const cleanPin = postalCode.replace(/\s+/g, '');
    result.pincode = cleanPin;
  }

  return result;
}

// ============================================================================
// Google Maps JS SDK Fallback (Legacy Support)
// ============================================================================

interface GoogleMapsScriptWindow extends Window {
  google?: {
    maps: {
      places: {
        AutocompleteService: new () => {
          getPlacePredictions: (
            request: { input: string },
            callback: (
              predictions: Array<{
                place_id: string;
                description: string;
                structured_formatting?: {
                  main_text: string;
                  secondary_text?: string;
                };
              }> | null,
              status: string,
            ) => void,
          ) => void;
        };
        PlacesService: new (attrContainer: HTMLDivElement) => {
          getDetails: (
            request: { placeId: string; fields?: string[] },
            callback: (
              place: {
                place_id?: string;
                name?: string;
                formatted_address?: string;
                address_components?: Array<{
                  long_name: string;
                  short_name: string;
                  types: string[];
                }>;
                geometry?: {
                  location?: {
                    lat: () => number;
                    lng: () => number;
                  };
                };
              } | null,
              status: string,
            ) => void,
          ) => void;
        };
        PlacesServiceStatus: {
          OK: string;
          ZERO_RESULTS: string;
          OVER_QUERY_LIMIT: string;
          REQUEST_DENIED: string;
          INVALID_REQUEST: string;
        };
      };
    };
  };
  gm_authFailure?: () => void;
}

let placesServiceInstance: InstanceType<
  NonNullable<NonNullable<GoogleMapsScriptWindow['google']>['maps']['places']['PlacesService']>
> | null = null;
let autocompleteServiceInstance: InstanceType<
  NonNullable<NonNullable<GoogleMapsScriptWindow['google']>['maps']['places']['AutocompleteService']>
> | null = null;


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
): Promise<ExtractedPlaceDetails> {
  await loadGoogleMapsSdk(apiKey);

  const win = window as GoogleMapsScriptWindow;
  if (!win.google?.maps?.places) {
    throw new Error('Google Maps Places library is unavailable.');
  }

  if (!placesServiceInstance) {
    const dummyDiv = document.createElement('div');
    placesServiceInstance = new win.google.maps.places.PlacesService(dummyDiv);
  }

  return new Promise<ExtractedPlaceDetails>((resolve, reject) => {
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

        const result: ExtractedPlaceDetails = {
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

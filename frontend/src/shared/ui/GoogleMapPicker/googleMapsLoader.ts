import type {
  GoogleMapsScriptWindow,
  GoogleMapsLibrary,
  GoogleMarkerLibrary,
  GooglePlacesLibrary,
  GoogleGeocodingLibrary,
} from './googleMap.types';

let mapsLoadingPromise: Promise<void> | null = null;
let mapsLibPromise: Promise<GoogleMapsLibrary> | null = null;
let markerLibPromise: Promise<GoogleMarkerLibrary> | null = null;
let placesLibPromise: Promise<GooglePlacesLibrary> | null = null;
let geocodingLibPromise: Promise<GoogleGeocodingLibrary> | null = null;

export function isGoogleMapsLoaded(): boolean {
  if (typeof window === 'undefined') return false;
  const win = window as GoogleMapsScriptWindow;
  return Boolean(win.google?.maps?.importLibrary || win.google?.maps?.Map);
}

export function loadGoogleMapsSdk(apiKey: string): Promise<void> {
  const win = window as GoogleMapsScriptWindow;

  if (win.google?.maps?.importLibrary) {
    return Promise.resolve();
  }

  if (mapsLoadingPromise) {
    return mapsLoadingPromise;
  }

  const trimmedKey = apiKey.trim();
  if (!trimmedKey) {
    return Promise.reject(
      new Error('Google Maps API key is missing. Please set VITE_GOOGLE_MAPS_API_KEY in your environment.'),
    );
  }

  mapsLoadingPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
    if (existingScript && win.google?.maps?.importLibrary) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      trimmedKey,
    )}&loading=async`;
    script.async = true;
    script.defer = true;

    win.gm_authFailure = () => {
      mapsLoadingPromise = null;
      reject(
        new Error(
          'Google Maps authentication failed. Please verify your Google Maps API key, enabled services, and referrer restrictions in Google Cloud Console.',
        ),
      );
    };

    script.onload = () => {
      const interval = setInterval(() => {
        if (win.google?.maps?.importLibrary) {
          clearInterval(interval);
          resolve();
        }
      }, 30);

      setTimeout(() => {
        clearInterval(interval);
        if (win.google?.maps?.importLibrary) {
          resolve();
        } else {
          mapsLoadingPromise = null;
          reject(new Error('Google Maps SDK loaded but failed to initialize importLibrary.'));
        }
      }, 5000);
    };

    script.onerror = () => {
      mapsLoadingPromise = null;
      reject(new Error('Failed to load Google Maps SDK script. Check your internet connection or ad blocker.'));
    };

    document.head.appendChild(script);
  });

  return mapsLoadingPromise;
}

export async function importMapsLibrary(apiKey: string): Promise<GoogleMapsLibrary> {
  await loadGoogleMapsSdk(apiKey);
  if (!mapsLibPromise) {
    const win = window as GoogleMapsScriptWindow;
    mapsLibPromise = win.google!.maps.importLibrary('maps') as Promise<GoogleMapsLibrary>;
  }
  return mapsLibPromise;
}

export async function importMarkerLibrary(apiKey: string): Promise<GoogleMarkerLibrary> {
  await loadGoogleMapsSdk(apiKey);
  if (!markerLibPromise) {
    const win = window as GoogleMapsScriptWindow;
    markerLibPromise = win.google!.maps.importLibrary('marker') as Promise<GoogleMarkerLibrary>;
  }
  return markerLibPromise;
}

export async function importPlacesLibrary(apiKey: string): Promise<GooglePlacesLibrary> {
  await loadGoogleMapsSdk(apiKey);
  if (!placesLibPromise) {
    const win = window as GoogleMapsScriptWindow;
    placesLibPromise = win.google!.maps.importLibrary('places') as Promise<GooglePlacesLibrary>;
  }
  return placesLibPromise;
}

export async function importGeocodingLibrary(apiKey: string): Promise<GoogleGeocodingLibrary> {
  await loadGoogleMapsSdk(apiKey);
  if (!geocodingLibPromise) {
    const win = window as GoogleMapsScriptWindow;
    geocodingLibPromise = win.google!.maps.importLibrary('geocoding') as Promise<GoogleGeocodingLibrary>;
  }
  return geocodingLibPromise;
}

import type { GoogleMapsScriptWindow } from '../types/googleMap.types';

let mapsLoadingPromise: Promise<void> | null = null;

export function isGoogleMapsLoaded(): boolean {
  if (typeof window === 'undefined') return false;
  const win = window as GoogleMapsScriptWindow;
  return Boolean(win.google?.maps?.Map && win.google?.maps?.Geocoder);
}

export function loadGoogleMapsSdk(apiKey: string): Promise<void> {
  const win = window as GoogleMapsScriptWindow;

  if (win.google?.maps?.Map && win.google?.maps?.Geocoder) {
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
    // Check if script tag is already in DOM
    const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
    if (existingScript && win.google?.maps) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      trimmedKey,
    )}&libraries=places&loading=async`;
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
        if (win.google?.maps?.Map && win.google?.maps?.Geocoder) {
          clearInterval(interval);
          resolve();
        }
      }, 50);

      setTimeout(() => {
        clearInterval(interval);
        if (win.google?.maps?.Map && win.google?.maps?.Geocoder) {
          resolve();
        } else {
          mapsLoadingPromise = null;
          reject(new Error('Google Maps SDK loaded but failed to initialize maps library.'));
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

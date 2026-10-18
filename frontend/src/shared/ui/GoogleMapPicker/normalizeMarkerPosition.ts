import type { GoogleLatLngLiteral, GoogleLatLngObject } from './googleMap.types';

export function normalizeMarkerPosition(
  pos:
    | GoogleLatLngLiteral
    | GoogleLatLngObject
    | { lat?: number | (() => number); lng?: number | (() => number) }
    | null
    | undefined,
): { lat: number; lng: number } | null {
  if (!pos) {
    return null;
  }

  const rawLat = typeof pos.lat === 'function' ? pos.lat() : pos.lat;
  const rawLng = typeof pos.lng === 'function' ? pos.lng() : pos.lng;

  if (typeof rawLat !== 'number' || typeof rawLng !== 'number') {
    return null;
  }

  if (Number.isNaN(rawLat) || Number.isNaN(rawLng)) {
    return null;
  }

  return {
    lat: rawLat,
    lng: rawLng,
  };
}

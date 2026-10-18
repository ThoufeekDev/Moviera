import { useState, useRef, useEffect, useCallback, type RefObject } from 'react';
import env from '@/shared/lib/env';
import type {
  GoogleMapInstance,
  GoogleAdvancedMarkerInstance,
  GoogleMapMouseEvent,
  ExtractedLocationDetails,
} from './googleMap.types';
import { importMapsLibrary, importMarkerLibrary } from './googleMapsLoader';
import { reverseGeocodeCoordinate } from './googleGeocoding';
import { normalizeMarkerPosition } from './normalizeMarkerPosition';

export interface UseGoogleMapInstanceOptions {
  apiKey?: string;
  mapElementRef: RefObject<HTMLDivElement | null>;
  selectedCoordinates?: { lat: number; lng: number } | null;
  defaultCenter: { lat: number; lng: number };
  defaultZoom: number;
  focusedZoom: number;
  disabled?: boolean;
  readOnly?: boolean;
  onSelectLocation: (details: ExtractedLocationDetails) => void;
}

export function useGoogleMapInstance({
  apiKey,
  mapElementRef,
  selectedCoordinates,
  defaultCenter,
  defaultZoom,
  focusedZoom,
  disabled = false,
  readOnly = false,
  onSelectLocation,
}: UseGoogleMapInstanceOptions) {
  const [isMapReady, setIsMapReady] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [mapNotice, setMapNotice] = useState<string | null>(null);

  const mapInstanceRef = useRef<GoogleMapInstance | null>(null);
  const markerInstanceRef = useRef<GoogleAdvancedMarkerInstance | null>(null);
  const onSelectLocationRef = useRef(onSelectLocation);

  useEffect(() => {
    onSelectLocationRef.current = onSelectLocation;
  }, [onSelectLocation]);

  const handlePinMoved = useCallback(
    async (lat: number, lng: number) => {
      if (!apiKey || disabled || readOnly) return;
      setIsGeocoding(true);
      setMapNotice(null);

      try {
        const details = await reverseGeocodeCoordinate(lat, lng, apiKey);
        onSelectLocationRef.current(details);
      } catch (err: unknown) {
        // Fall back to sending raw pin coordinates so the user is not blocked
        onSelectLocationRef.current({
          googlePlaceId: '',
          address: `Pinned Location (${lat.toFixed(5)}, ${lng.toFixed(5)})`,
          latitude: lat,
          longitude: lng,
        });

        const rawMsg = err instanceof Error ? err.message : 'Reverse geocoding unavailable.';
        if (rawMsg.includes('REQUEST_DENIED')) {
          setMapNotice(
            'Reverse geocoding request was denied. Ensure "Geocoding API" is enabled in your Google Cloud Console project.',
          );
        } else {
          setMapNotice(`Address lookup notice: ${rawMsg}`);
        }
      } finally {
        setIsGeocoding(false);
      }
    },
    [apiKey, disabled, readOnly],
  );

  // Initialize Map and AdvancedMarkerElement
  useEffect(() => {
    if (!apiKey || !mapElementRef.current) return;
    let isCancelled = false;

    Promise.all([importMapsLibrary(apiKey), importMarkerLibrary(apiKey)])
      .then(([mapsLib, markerLib]) => {
        if (isCancelled || !mapElementRef.current) return;

        const initialPos = selectedCoordinates || defaultCenter;
        const initialZoom = selectedCoordinates ? focusedZoom : defaultZoom;

        const map = new mapsLib.Map(mapElementRef.current, {
          center: initialPos,
          zoom: initialZoom,
          mapId: env.googleMapsMapId,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
          clickableIcons: !readOnly,
        });

        const marker = new markerLib.AdvancedMarkerElement({
          map: selectedCoordinates ? map : null,
          position: initialPos,
          gmpDraggable: !disabled && !readOnly,
          title: 'Selected Location (drag to reposition)',
        });

        // Marker dragend event (AdvancedMarkerElement supports gmp-dragend)
        marker.addEventListener('gmp-dragend', () => {
          if (readOnly) return;
          const normalized = normalizeMarkerPosition(marker.position);
          if (normalized) {
            handlePinMoved(normalized.lat, normalized.lng);
          }
        });

        // Map click event
        map.addListener('click', (e: GoogleMapMouseEvent) => {
          if (disabled || readOnly || !e.latLng) return;
          const normalized = normalizeMarkerPosition(e.latLng);
          if (normalized) {
            marker.position = normalized;
            marker.map = map;
            handlePinMoved(normalized.lat, normalized.lng);
          }
        });

        mapInstanceRef.current = map;
        markerInstanceRef.current = marker;
        setIsMapReady(true);
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          const msg = err instanceof Error ? err.message : 'Unable to initialize Google Maps.';
          setMapNotice(msg);
        }
      });

    return () => {
      isCancelled = true;
      if (markerInstanceRef.current) {
        markerInstanceRef.current.map = null;
        markerInstanceRef.current = null;
      }
      mapInstanceRef.current = null;
    };
  }, [apiKey, mapElementRef, disabled, readOnly, handlePinMoved, defaultCenter, defaultZoom, focusedZoom, selectedCoordinates]);

  // Sync external coordinates changes into map and marker
  useEffect(() => {
    if (selectedCoordinates && isMapReady) {
      if (markerInstanceRef.current) {
        markerInstanceRef.current.position = selectedCoordinates;
        markerInstanceRef.current.map = mapInstanceRef.current;
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.panTo(selectedCoordinates);
      }
    }
  }, [selectedCoordinates, isMapReady]);

  const recenterMap = useCallback(
    (coords: { lat: number; lng: number }) => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.panTo(coords);
        mapInstanceRef.current.setZoom(focusedZoom);
      }
      if (markerInstanceRef.current) {
        markerInstanceRef.current.position = coords;
        markerInstanceRef.current.map = mapInstanceRef.current;
      }
    },
    [focusedZoom],
  );

  return {
    isMapReady,
    isGeocoding,
    mapNotice,
    setMapNotice,
    recenterMap,
    handlePinMoved,
  };
}

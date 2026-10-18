import { useState, useRef } from 'react';
import { LocateFixed, Loader2, AlertCircle, Crosshair } from 'lucide-react';
import env from '@/shared/lib/env';
import { Button } from '@/shared/ui/Button';
import { cn } from '@/shared/lib/cn';
import type { ExtractedLocationDetails } from './googleMap.types';
import { GooglePlacesSearch } from './GooglePlacesSearch';
import { MissingApiKeyBanner } from './MissingApiKeyBanner';
import { useGoogleMapInstance } from './useGoogleMapInstance';

export interface GoogleMapPickerProps {
  onSelectLocation: (details: ExtractedLocationDetails) => void;
  onSwitchToManual?: () => void;
  selectedPlaceId?: string | null;
  selectedAddress?: string | null;
  selectedCoordinates?: { lat: number; lng: number } | null;
  heightClassName?: string;
  defaultCenter?: { lat: number; lng: number };
  defaultZoom?: number;
  focusedZoom?: number;
  searchPlaceholder?: string;
  label?: string | null;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
}

const FALLBACK_CENTER = { lat: 12.9716, lng: 77.5946 };
const FALLBACK_DEFAULT_ZOOM = 12;
const FALLBACK_FOCUSED_ZOOM = 16;

export function GoogleMapPicker({
  onSelectLocation,
  onSwitchToManual,
  selectedPlaceId,
  selectedAddress,
  selectedCoordinates,
  heightClassName = 'h-[300px] sm:h-[360px]',
  defaultCenter = FALLBACK_CENTER,
  defaultZoom = FALLBACK_DEFAULT_ZOOM,
  focusedZoom = FALLBACK_FOCUSED_ZOOM,
  label = 'Search Place, Theatre, or Landmark',
  disabled = false,
  readOnly = false,
  className,
}: GoogleMapPickerProps) {
  const apiKey = env.googleMapsApiKey;
  const mapElementRef = useRef<HTMLDivElement>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const {
    isMapReady,
    isGeocoding,
    mapNotice,
    recenterMap,
    handlePinMoved,
  } = useGoogleMapInstance({
    apiKey,
    mapElementRef,
    selectedCoordinates,
    defaultCenter,
    defaultZoom,
    focusedZoom,
    disabled,
    readOnly,
    onSelectLocation,
  });

  const handlePlaceSelected = (details: ExtractedLocationDetails) => {
    onSelectLocation(details);
    if (details.latitude !== undefined && details.longitude !== undefined) {
      recenterMap({ lat: details.latitude, lng: details.longitude });
    }
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        recenterMap(coords);
        handlePinMoved(coords.lat, coords.lng);
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        setGeoError(
          err.code === 1
            ? 'Location access was denied. Please allow location permissions in your browser.'
            : 'Unable to retrieve your current location.',
        );
      },
      { timeout: 10000, enableHighAccuracy: true },
    );
  };

  if (!apiKey || apiKey.trim() === '') {
    return <MissingApiKeyBanner onSwitchToManual={onSwitchToManual} className={className} />;
  }

  return (
    <div className={cn('space-y-3', className)}>
      <GooglePlacesSearch
        onSelectPlace={handlePlaceSelected}
        onSwitchToManual={onSwitchToManual || (() => {})}
        selectedPlaceId={selectedPlaceId}
        selectedAddress={selectedAddress}
        disabled={disabled}
        label={label}
      />

      {(geoError || mapNotice) && (
        <div
          role="status"
          className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50/90 p-3 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">Map Notice: </span>
            <span>{geoError || mapNotice}</span>
          </div>
        </div>
      )}

      {/* Map Canvas and Overlays */}
      <div className="relative w-full rounded-lg border border-border shadow-xs overflow-hidden">
        <div
          ref={mapElementRef}
          className={cn('w-full bg-surface-muted/60 transition-opacity duration-300', heightClassName)}
        />

        {!isMapReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface/80 backdrop-blur-2xs text-ink-muted">
            <Loader2 className="h-6 w-6 animate-spin text-brand-600 mb-2" />
            <span className="text-xs font-medium">Initializing Google Map...</span>
          </div>
        )}

        {isMapReady && (
          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
            {!readOnly && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleLocateMe}
                disabled={disabled || isLocating}
                className="h-8 shadow-md bg-surface hover:bg-surface-muted text-ink text-xs flex items-center gap-1.5 cursor-pointer"
                title="Use current GPS location"
              >
                {isLocating ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-600" />
                ) : (
                  <LocateFixed className="h-3.5 w-3.5 text-brand-600" />
                )}
                <span>{isLocating ? 'Locating...' : 'My Location'}</span>
              </Button>
            )}

            {selectedCoordinates && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => recenterMap(selectedCoordinates)}
                disabled={disabled}
                className="h-8 shadow-md bg-surface hover:bg-surface-muted text-ink text-xs flex items-center gap-1.5 cursor-pointer"
                title="Recenter map on current pin"
              >
                <Crosshair className="h-3.5 w-3.5 text-ink-muted" />
                <span>Center Pin</span>
              </Button>
            )}
          </div>
        )}

        {isGeocoding && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-surface/90 px-3 py-1 shadow-md text-xs text-brand-600 font-medium">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Resolving address...</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default GoogleMapPicker;

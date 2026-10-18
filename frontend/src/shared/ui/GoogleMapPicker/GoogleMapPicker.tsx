import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type KeyboardEvent,
  type ChangeEvent,
} from 'react';
import {
  Search,
  MapPin,
  Loader2,
  X,
  AlertTriangle,
  CheckCircle2,
  LocateFixed,
  Crosshair,
} from 'lucide-react';
import env from '@/shared/lib/env';
import { Button } from '@/shared/ui/Button';
import { cn } from '@/shared/lib/cn';
import type {
  GoogleMapInstance,
  GoogleMarkerInstance,
  GoogleMapsScriptWindow,
  GoogleMapMouseEvent,
  GooglePlacePrediction,
  ExtractedLocationDetails,
} from './googleMap.types';
import { loadGoogleMapsSdk } from './googleMapsLoader';
import { reverseGeocodeCoordinate } from './googleGeocoding';
import { fetchPlacePredictions, fetchPlaceDetails } from './googlePlaces';

export interface GoogleMapPickerProps {
  /** Callback triggered whenever a location is chosen via autocomplete, map click, or pin drag */
  onSelectLocation: (details: ExtractedLocationDetails) => void;
  /** Optional callback to toggle manual address entry mode */
  onSwitchToManual?: () => void;
  /** Currently selected place ID */
  selectedPlaceId?: string | null;
  /** Formatted address of the selected location */
  selectedAddress?: string | null;
  /** Selected coordinates ({ lat, lng }) */
  selectedCoordinates?: { lat: number; lng: number } | null;
  /** CSS class to specify height of the map canvas (defaults to h-[300px] sm:h-[360px]) */
  heightClassName?: string;
  /** Default map center when no coordinates are set */
  defaultCenter?: { lat: number; lng: number };
  /** Default zoom when no coordinate is set */
  defaultZoom?: number;
  /** Zoom level when a place/coordinate is focused */
  focusedZoom?: number;
  /** Search input placeholder */
  searchPlaceholder?: string;
  /** Custom label above search bar, or null to hide */
  label?: string | null;
  /** Disables search and map interactions */
  disabled?: boolean;
  /** If true, pins can be viewed but not moved/dragged */
  readOnly?: boolean;
  /** Additional container classes */
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
  searchPlaceholder = 'Search theatre, place, or area (e.g. PVR Forum Mall, Bengaluru)...',
  label = 'Search Place, Theatre, or Landmark',
  disabled = false,
  readOnly = false,
  className,
}: GoogleMapPickerProps) {
  const apiKey = env.googleMapsApiKey;

  // Search state
  const [query, setQuery] = useState('');
  const [predictions, setPredictions] = useState<GooglePlacePrediction[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Map state
  const [isMapReady, setIsMapReady] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active pin coordinates
  const [internalCoords, setInternalCoords] = useState<{ lat: number; lng: number } | null>(null);
  const markerPos = internalCoords ?? selectedCoordinates ?? null;

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mapElementRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mapInstanceRef = useRef<GoogleMapInstance | null>(null);
  const markerInstanceRef = useRef<GoogleMarkerInstance | null>(null);

  // Close prediction dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, []);

  // Sync external coordinates changes into map and marker
  useEffect(() => {
    if (selectedCoordinates) {
      if (markerInstanceRef.current) {
        markerInstanceRef.current.setPosition(selectedCoordinates);
        markerInstanceRef.current.setVisible(true);
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.panTo(selectedCoordinates);
      }
    }
  }, [selectedCoordinates]);

  // Reverse geocode when pin moves (via drag or map click)
  const handlePinMoved = useCallback(
    async (lat: number, lng: number) => {
      if (!apiKey || disabled || readOnly) return;
      setInternalCoords({ lat, lng });
      setIsGeocoding(true);
      setErrorMessage(null);

      try {
        const details = await reverseGeocodeCoordinate(lat, lng, apiKey);
        onSelectLocation(details);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to retrieve address for location.';
        setErrorMessage(msg);
      } finally {
        setIsGeocoding(false);
      }
    },
    [apiKey, disabled, readOnly, onSelectLocation],
  );

  // Initialize Google Map
  useEffect(() => {
    if (!apiKey || !mapElementRef.current) return;
    let isCancelled = false;

    loadGoogleMapsSdk(apiKey)
      .then(() => {
        if (isCancelled || !mapElementRef.current) return;
        const win = window as GoogleMapsScriptWindow;
        if (!win.google?.maps?.Map) {
          throw new Error('Google Maps library failed to load.');
        }

        const initialPos = markerPos || defaultCenter;
        const initialZoom = markerPos ? focusedZoom : defaultZoom;

        const map = new win.google.maps.Map(mapElementRef.current, {
          center: initialPos,
          zoom: initialZoom,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
          clickableIcons: !readOnly,
        });

        const marker = new win.google.maps.Marker({
          position: initialPos,
          map: map,
          draggable: !disabled && !readOnly,
          title: 'Selected Location (drag to reposition)',
          animation: win.google.maps.Animation?.DROP,
        });

        if (!markerPos) {
          marker.setVisible(false);
        }

        // Marker dragend listener
        marker.addListener('dragend', () => {
          if (readOnly) return;
          const pos = marker.getPosition();
          if (pos) {
            const lat = typeof pos.lat === 'function' ? pos.lat() : pos.lat;
            const lng = typeof pos.lng === 'function' ? pos.lng() : pos.lng;
            handlePinMoved(lat, lng);
          }
        });

        // Map click listener to place or move marker
        map.addListener('click', (e: GoogleMapMouseEvent) => {
          if (disabled || readOnly || !e.latLng) return;
          const lat = typeof e.latLng.lat === 'function' ? e.latLng.lat() : e.latLng.lat;
          const lng = typeof e.latLng.lng === 'function' ? e.latLng.lng() : e.latLng.lng;

          marker.setPosition({ lat, lng });
          marker.setVisible(true);
          handlePinMoved(lat, lng);
        });

        mapInstanceRef.current = map;
        markerInstanceRef.current = marker;
        setIsMapReady(true);
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          const msg = err instanceof Error ? err.message : 'Unable to initialize Google Maps.';
          setErrorMessage(msg);
        }
      });

    return () => {
      isCancelled = true;
      if (markerInstanceRef.current) {
        markerInstanceRef.current.setMap(null);
        markerInstanceRef.current = null;
      }
      mapInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, disabled, readOnly, handlePinMoved, defaultCenter, defaultZoom, focusedZoom]);

  // Place search autocomplete query change
  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setQuery(text);
    setErrorMessage(null);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!text.trim() || text.trim().length < 2) {
      setPredictions([]);
      setIsOpen(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setIsOpen(true);

    debounceTimerRef.current = setTimeout(async () => {
      if (!apiKey) return;
      try {
        const results = await fetchPlacePredictions(text, apiKey);
        setPredictions(results);
        setActiveIndex(results.length > 0 ? 0 : -1);
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Unable to search places. Try clicking directly on the map or enter manually.';
        setErrorMessage(msg);
        setPredictions([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);
  };

  // Place selected from search predictions
  const handleSelectPrediction = async (prediction: GooglePlacePrediction) => {
    if (!apiKey) return;

    setIsSelecting(true);
    setIsOpen(false);
    setErrorMessage(null);

    try {
      const details = await fetchPlaceDetails(prediction.placeId, apiKey);
      onSelectLocation(details);

      setQuery(prediction.mainText);
      setPredictions([]);

      if (details.latitude !== undefined && details.longitude !== undefined) {
        const newCoords = { lat: details.latitude, lng: details.longitude };
        setInternalCoords(newCoords);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo(newCoords);
          mapInstanceRef.current.setZoom(focusedZoom);
        }
        if (markerInstanceRef.current) {
          markerInstanceRef.current.setPosition(newCoords);
          markerInstanceRef.current.setVisible(true);
        }
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to retrieve place details from Google Places.';
      setErrorMessage(msg);
    } finally {
      setIsSelecting(false);
    }
  };

  // Locate current position
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setInternalCoords(coords);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo(coords);
          mapInstanceRef.current.setZoom(focusedZoom);
        }
        if (markerInstanceRef.current) {
          markerInstanceRef.current.setPosition(coords);
          markerInstanceRef.current.setVisible(true);
        }

        handlePinMoved(coords.lat, coords.lng);
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        setErrorMessage(
          err.code === 1
            ? 'Location access was denied. Please allow location permissions in your browser.'
            : 'Unable to retrieve your current location. Please use search or click on the map.',
        );
      },
      { timeout: 10000, enableHighAccuracy: true },
    );
  };

  // Recenter map to marker
  const handleRecenter = () => {
    if (markerPos && mapInstanceRef.current) {
      mapInstanceRef.current.panTo(markerPos);
      mapInstanceRef.current.setZoom(focusedZoom);
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    setPredictions([]);
    setIsOpen(false);
    searchInputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled || isSelecting) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen && predictions.length > 0) setIsOpen(true);
        else if (predictions.length > 0) {
          setActiveIndex((prev) => (prev + 1) % predictions.length);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen && predictions.length > 0) {
          setActiveIndex((prev) => (prev <= 0 ? predictions.length - 1 : prev - 1));
        }
        break;
      case 'Enter':
        if (isOpen && activeIndex >= 0 && activeIndex < predictions.length) {
          e.preventDefault();
          handleSelectPrediction(predictions[activeIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
        break;
      default:
        break;
    }
  };

  // Missing API Key Banner
  if (!apiKey || apiKey.trim() === '') {
    return (
      <div className={cn('rounded-lg border border-amber-300/80 bg-amber-50/70 p-4 text-amber-900 dark:border-amber-700/50 dark:bg-amber-950/20 dark:text-amber-200', className)}>
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div className="space-y-1.5 text-sm">
            <h5 className="font-semibold text-amber-900 dark:text-amber-100">
              Google Maps Platform API Key Required
            </h5>
            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
              Interactive Google Maps search and map-pinning requires an API key via{' '}
              <code className="rounded bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 font-mono text-[11px]">
                VITE_GOOGLE_MAPS_API_KEY
              </code>{' '}
              with Maps JavaScript API, Places API, and Geocoding API enabled.
            </p>
            {onSwitchToManual && (
              <div className="pt-2 flex items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={onSwitchToManual}
                  className="text-xs cursor-pointer font-medium"
                >
                  Switch to Manual Address Entry
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Error alert */}
      {errorMessage && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-danger-200 bg-danger-50 p-3 text-danger-700 text-xs sm:text-sm"
        >
          <AlertTriangle className="h-4 w-4 shrink-0 text-danger-600 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">Map Notice:</span>
            <p className="mt-0.5 text-xs">{errorMessage}</p>
          </div>
          {onSwitchToManual && (
            <button
              type="button"
              onClick={onSwitchToManual}
              className="text-xs font-semibold text-brand-700 hover:underline shrink-0 cursor-pointer"
            >
              Enter manually
            </button>
          )}
        </div>
      )}

      {/* Autocomplete Search Bar */}
      <div ref={containerRef} className="relative w-full">
        {label && (
          <label
            htmlFor="google-map-search-input"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-muted"
          >
            {label}
          </label>
        )}

        <div className="relative flex w-full items-center">
          <div className="pointer-events-none absolute left-3.5 flex items-center text-ink-muted">
            <Search className="h-4 w-4" aria-hidden="true" />
          </div>

          <input
            ref={searchInputRef}
            id="google-map-search-input"
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isOpen}
            aria-controls="google-map-search-results"
            disabled={disabled || isSelecting}
            value={query}
            onChange={handleQueryChange}
            onFocus={() => {
              if (predictions.length > 0) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder={searchPlaceholder}
            autoComplete="off"
            className={cn(
              'h-11 min-h-[44px] w-full rounded-md border border-border bg-surface pl-10 pr-28',
              'text-base md:text-sm text-ink placeholder:text-ink-muted',
              'transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-ink-muted',
            )}
          />

          <div className="absolute right-2.5 flex items-center gap-1.5">
            {query && !disabled && !isSearching && !isSelecting && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Clear search"
                className="flex h-6 w-6 items-center justify-center rounded-full text-ink-muted hover:bg-surface-muted hover:text-ink transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}

            {(isSearching || isSelecting) && (
              <div className="flex h-6 w-6 items-center justify-center text-brand-600">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}

            {/* Locate Me button */}
            {!readOnly && (
              <button
                type="button"
                onClick={handleLocateMe}
                disabled={disabled || isLocating}
                title="Use current GPS location"
                aria-label="Use current location"
                className={cn(
                  'flex h-7 items-center gap-1 rounded px-2 text-xs font-medium transition-colors cursor-pointer',
                  'bg-surface-muted text-ink hover:bg-surface hover:text-brand-600 border border-border',
                  isLocating && 'opacity-60 cursor-not-allowed',
                )}
              >
                {isLocating ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-600" />
                ) : (
                  <LocateFixed className="h-3.5 w-3.5 text-brand-600" />
                )}
                <span className="hidden sm:inline">My Location</span>
              </button>
            )}
          </div>
        </div>

        {/* Prediction Dropdown */}
        {isOpen && (
          <div
            id="google-map-search-results"
            className="absolute top-[calc(100%+4px)] left-0 z-50 w-full overflow-hidden rounded-lg border border-border bg-surface shadow-xl animate-in fade-in-50 zoom-in-95 duration-100"
          >
            <ul className="max-h-60 overflow-y-auto py-1 text-sm focus:outline-none" role="listbox">
              {isSearching && predictions.length === 0 ? (
                <li className="flex items-center justify-center gap-2 px-3 py-5 text-ink-muted text-xs">
                  <Loader2 className="h-4 w-4 animate-spin text-brand-600" />
                  <span>Searching locations...</span>
                </li>
              ) : predictions.length === 0 ? (
                <li className="px-4 py-5 text-center text-ink-muted text-xs">
                  <p className="font-medium">No places found</p>
                  <p className="mt-1 text-[11px]">
                    Try searching landmark name, or click directly on the map below.
                  </p>
                </li>
              ) : (
                predictions.map((p, index) => {
                  const isHighlighted = index === activeIndex;
                  return (
                    <li
                      key={p.placeId}
                      role="option"
                      aria-selected={isHighlighted}
                      onClick={() => handleSelectPrediction(p)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={cn(
                        'relative flex items-start gap-3 px-3.5 py-2.5 cursor-pointer transition-colors select-none border-b border-border/40 last:border-b-0',
                        isHighlighted ? 'bg-surface-muted text-ink' : 'text-ink',
                      )}
                    >
                      <MapPin className="h-4 w-4 shrink-0 text-brand-600 mt-1" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-ink text-sm">{p.mainText}</p>
                        {p.secondaryText && (
                          <p className="truncate text-xs text-ink-muted mt-0.5">{p.secondaryText}</p>
                        )}
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
            <div className="flex items-center justify-between border-t border-border bg-surface-muted/50 px-3.5 py-1.5 text-[11px] text-ink-muted">
              <span>Powered by Google Maps Platform</span>
              {onSwitchToManual && (
                <button
                  type="button"
                  onClick={onSwitchToManual}
                  className="font-medium text-brand-600 hover:underline cursor-pointer"
                >
                  Switch to manual entry
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Google Map Canvas */}
      <div className="relative w-full rounded-lg border border-border bg-surface-muted/40 overflow-hidden shadow-2xs">
        <div
          ref={mapElementRef}
          className={cn('w-full', heightClassName)}
          tabIndex={0}
          aria-label="Interactive Google Map. Click to place marker or drag pin to fine-tune."
        />

        {/* Loading overlay when initializing map */}
        {!isMapReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface/85 backdrop-blur-xs gap-2 z-10">
            <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
            <span className="text-xs font-medium text-ink-muted">Loading Google Map...</span>
          </div>
        )}

        {/* Geocoding overlay when pin moves */}
        {isGeocoding && (
          <div className="absolute top-3 left-3 z-20 flex items-center gap-2 rounded-md bg-surface/90 px-3 py-1.5 text-xs font-medium text-ink shadow-sm border border-border/70 backdrop-blur-xs animate-in fade-in duration-150">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-600" />
            <span>Resolving exact address details...</span>
          </div>
        )}

        {/* Instruction overlay badge */}
        {isMapReady && !readOnly && (
          <div className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-1.5 rounded-md bg-surface/90 px-2.5 py-1 text-[11px] font-medium text-ink-muted shadow-xs border border-border/60 backdrop-blur-xs">
            <Crosshair className="h-3 w-3 text-brand-600" />
            <span>Click map or drag pin to position</span>
          </div>
        )}
      </div>

      {/* Selected Location Details Card */}
      {markerPos && selectedAddress && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-emerald-300/80 bg-emerald-50/60 p-3 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-100">
          <div className="flex items-start gap-2.5 min-w-0">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
            <div className="min-w-0 text-xs sm:text-sm">
              <span className="font-semibold block text-emerald-950 dark:text-emerald-100">
                Accurate Location Pinned
              </span>
              <p className="mt-0.5 line-clamp-1 text-ink">{selectedAddress}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2 font-mono text-[11px] text-ink-muted">
                <span>
                  Lat: <strong className="text-ink">{markerPos.lat.toFixed(5)}</strong>
                </span>
                <span>
                  Lng: <strong className="text-ink">{markerPos.lng.toFixed(5)}</strong>
                </span>
                {selectedPlaceId && (
                  <span className="truncate">
                    ID: <code className="text-ink font-semibold">{selectedPlaceId}</code>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRecenter}
              className="text-xs h-8 flex items-center gap-1.5 cursor-pointer"
            >
              <Crosshair className="h-3.5 w-3.5" />
              <span>Recenter</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GoogleMapPicker;

import { useEffect, useRef, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { AlertTriangle, Loader2 } from 'lucide-react';
import env from '@/shared/lib/env';
import { cn } from '@/shared/lib/cn';
import type {
  ExtractedPlaceDetails,
  PlaceInstance,
  PlaceSelectEvent,
} from './googleMap.types';
import { importPlacesLibrary } from './googleMapsLoader';
import { placeToExtractedDetails } from './placeToExtractedDetails';
import { MissingApiKeyBanner } from './MissingApiKeyBanner';
import { SelectedLocationCard } from './SelectedLocationCard';

export interface GooglePlacesSearchProps {
  onSelectPlace: (details: ExtractedPlaceDetails) => void;
  onSwitchToManual: () => void;
  selectedPlaceId?: string | null;
  selectedAddress?: string | null;
  disabled?: boolean;
  label?: string | null;
}

function applyElementStyling(el: HTMLElement) {
  el.setAttribute('placeholder', 'Search theatre, mall, or address (e.g. PVR Forum Mall, Bengaluru)...');
  Object.assign(el.style, {
    width: '100%',
    display: 'block',
    colorScheme: 'light',
    backgroundColor: '#ffffff',
    color: '#111827',
    border: '1px solid #e5e7eb',
    borderRadius: '0.375rem',
  });
}

export function GooglePlacesSearch({
  onSelectPlace,
  onSwitchToManual,
  selectedPlaceId,
  selectedAddress,
  disabled = false,
  label = 'Search Place, Cinema, or Address *',
}: GooglePlacesSearchProps) {
  const apiKey = env.googleMapsApiKey;
  const containerRef = useRef<HTMLDivElement>(null);
  const activeElementRef = useRef<HTMLElement | null>(null);

  const onSelectPlaceRef = useRef(onSelectPlace);
  useEffect(() => {
    onSelectPlaceRef.current = onSelectPlace;
  }, [onSelectPlace]);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const handleSelect = useCallback(async (e: Event) => {
    const selectEvent = e as PlaceSelectEvent;
    let place: PlaceInstance | null = null;

    if (selectEvent.placePrediction?.toPlace) {
      place = selectEvent.placePrediction.toPlace();
    } else if (selectEvent.place) {
      place = selectEvent.place;
    }

    if (!place) {
      return;
    }

    setIsFetchingDetails(true);
    try {
      await place.fetchFields({
        fields: ['id', 'displayName', 'formattedAddress', 'addressComponents', 'location'],
      });
      const details = placeToExtractedDetails(place);
      onSelectPlaceRef.current(details);
    } catch (fetchErr: unknown) {
      const msg =
        fetchErr instanceof Error
          ? fetchErr.message
          : 'Failed to retrieve place details from Google Places.';
      toast.error(`Unable to load place details: ${msg}`);
    } finally {
      setIsFetchingDetails(false);
    }
  }, []);

  const handleSelectRef = useRef(handleSelect);
  useEffect(() => {
    handleSelectRef.current = handleSelect;
  }, [handleSelect]);

  const mountAutocomplete = useCallback(async () => {
    const container = containerRef.current;
    if (!apiKey || !container) return;

    setIsLoading(true);
    setLoadError(null);

    try {
      const placesLib = await importPlacesLibrary(apiKey);
      const autocomplete = new placesLib.PlaceAutocompleteElement({
        includedRegionCodes: ['in'],
      });

      applyElementStyling(autocomplete);

      autocomplete.addEventListener('gmp-select', (e) => handleSelectRef.current(e));
      autocomplete.addEventListener('gmp-placeselect', (e) => handleSelectRef.current(e));

      // Atomically replace all children to guarantee exactly ONE search bar
      container.replaceChildren(autocomplete);
      activeElementRef.current = autocomplete;
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Unable to load Google Places library. Please verify your connection or switch to manual entry.';
      setLoadError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  useEffect(() => {
    let isCancelled = false;
    const container = containerRef.current;

    async function init() {
      if (!apiKey || !container) return;
      setIsLoading(true);
      setLoadError(null);

      try {
        const placesLib = await importPlacesLibrary(apiKey);
        if (isCancelled) return;

        const autocomplete = new placesLib.PlaceAutocompleteElement({
          includedRegionCodes: ['in'],
        });

        applyElementStyling(autocomplete);

        autocomplete.addEventListener('gmp-select', (e) => handleSelectRef.current(e));
        autocomplete.addEventListener('gmp-placeselect', (e) => handleSelectRef.current(e));

        container.replaceChildren(autocomplete);
        activeElementRef.current = autocomplete;
      } catch (err: unknown) {
        if (isCancelled) return;
        const msg =
          err instanceof Error
            ? err.message
            : 'Unable to load Google Places library. Please verify your connection or switch to manual entry.';
        setLoadError(msg);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    if (apiKey) {
      init();
    }

    return () => {
      isCancelled = true;
      if (container) {
        container.replaceChildren();
      }
      activeElementRef.current = null;
    };
  }, [apiKey]);

  if (!apiKey || apiKey.trim() === '') {
    return <MissingApiKeyBanner onSwitchToManual={onSwitchToManual} />;
  }

  return (
    <div className="space-y-3">
      {selectedAddress && (
        <SelectedLocationCard
          selectedPlaceId={selectedPlaceId}
          selectedAddress={selectedAddress}
          onSearchAnother={() => {
            mountAutocomplete();
          }}
        />
      )}

      {loadError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-danger-200 bg-danger-50 p-3 text-danger-700 text-xs sm:text-sm"
        >
          <AlertTriangle className="h-4 w-4 shrink-0 text-danger-600 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">Google Places Unavailable:</span>
            <p className="mt-0.5 text-xs">{loadError}</p>
          </div>
          <button
            type="button"
            onClick={onSwitchToManual}
            className="text-xs font-semibold text-brand-700 hover:underline shrink-0 cursor-pointer"
          >
            Enter manually
          </button>
        </div>
      )}

      <div>
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-ink">
            {label}
          </label>
        )}

        <div
          className={cn(
            'relative w-full rounded-md',
            disabled && 'pointer-events-none opacity-50',
          )}
          aria-disabled={disabled}
        >
          {/* Autocomplete element container - never add overflow:hidden here */}
          <div ref={containerRef} className="w-full min-h-[44px]" />

          {(isLoading || isFetchingDetails) && (
            <div className="absolute right-3 top-2.5 flex items-center gap-1.5 text-xs text-brand-600 bg-surface/80 px-2 py-0.5 rounded">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>{isFetchingDetails ? 'Fetching details...' : 'Loading Places...'}</span>
            </div>
          )}
        </div>

        <p className="mt-1 text-xs text-ink-muted">
          Selecting a Google Place automatically populates address details, city, state, postal code,
          and coordinates.
        </p>
      </div>
    </div>
  );
}

export default GooglePlacesSearch;

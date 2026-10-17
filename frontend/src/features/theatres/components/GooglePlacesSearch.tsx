import {
  useState,
  useRef,
  useEffect,
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
  RotateCcw,
} from 'lucide-react';
import env from '@/shared/lib/env';
import { Button } from '@/shared/ui';
import { cn } from '@/shared/lib/cn';
import {
  fetchPlacePredictions,
  fetchPlaceDetails,
  type GooglePlacePrediction,
  type ExtractedPlaceDetails,
} from '../services/googlePlaces.service';

export interface GooglePlacesSearchProps {
  onSelectPlace: (details: ExtractedPlaceDetails) => void;
  onSwitchToManual: () => void;
  selectedPlaceId?: string | null;
  selectedAddress?: string | null;
  disabled?: boolean;
}

export function GooglePlacesSearch({
  onSelectPlace,
  onSwitchToManual,
  selectedPlaceId,
  selectedAddress,
  disabled = false,
}: GooglePlacesSearchProps) {
  const apiKey = env.googleMapsApiKey;

  const [query, setQuery] = useState('');
  const [predictions, setPredictions] = useState<GooglePlacePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdown on click outside
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

  // Debounced place search
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
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
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
            : 'Unable to search Google Places. Please try again or switch to manual entry.';
        setErrorMessage(msg);
        setPredictions([]);
      } finally {
        setIsLoading(false);
      }
    }, 350);
  };

  const handleSelectPrediction = async (prediction: GooglePlacePrediction) => {
    if (!apiKey) return;

    setIsSelecting(true);
    setIsOpen(false);
    setErrorMessage(null);

    try {
      const details = await fetchPlaceDetails(prediction.placeId, apiKey);
      onSelectPlace(details);
      setQuery('');
      setPredictions([]);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Failed to retrieve place details from Google Places.';
      setErrorMessage(msg);
    } finally {
      setIsSelecting(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setPredictions([]);
    setIsOpen(false);
    setErrorMessage(null);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled || isSelecting) return;

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        if (!isOpen) {
          if (predictions.length > 0) setIsOpen(true);
        } else if (predictions.length > 0) {
          setActiveIndex((prev) => (prev + 1) % predictions.length);
        }
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        if (isOpen && predictions.length > 0) {
          setActiveIndex((prev) => (prev <= 0 ? predictions.length - 1 : prev - 1));
        }
        break;
      }
      case 'Enter': {
        if (isOpen && activeIndex >= 0 && activeIndex < predictions.length) {
          e.preventDefault();
          handleSelectPrediction(predictions[activeIndex]);
        }
        break;
      }
      case 'Escape': {
        e.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
        break;
      }
      default:
        break;
    }
  };

  // Case 1: Missing API Key Configuration
  if (!apiKey || apiKey.trim() === '') {
    return (
      <div className="rounded-lg border border-amber-300/80 bg-amber-50/70 p-4 text-amber-900 dark:border-amber-700/50 dark:bg-amber-950/20 dark:text-amber-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div className="space-y-1.5 text-sm">
            <h5 className="font-semibold text-amber-900 dark:text-amber-100">
              Google Places API Key Required
            </h5>
            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
              Google Places search is currently unconfigured. To enable place auto-lookup, provide a
              browser-restricted API key via{' '}
              <code className="rounded bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 font-mono text-[11px]">
                VITE_GOOGLE_MAPS_API_KEY
              </code>{' '}
              in your frontend environment, and enable the Places API with active billing in Google Cloud
              Console.
            </p>
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* If place has been successfully chosen, show confirmation badge */}
      {selectedPlaceId && selectedAddress && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-emerald-300/80 bg-emerald-50/60 p-3.5 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-200">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <span className="font-semibold block text-emerald-950 dark:text-emerald-100">
                Google Place Connected
              </span>
              <p className="mt-0.5 line-clamp-1 text-ink">{selectedAddress}</p>
              <div className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-ink-muted">
                <span>Place ID:</span>
                <span className="rounded bg-surface-muted px-1.5 py-0.5 font-semibold text-ink">
                  {selectedPlaceId}
                </span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                inputRef.current?.focus();
              }}
              className="text-xs h-8 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Search Another</span>
            </Button>
          </div>
        </div>
      )}

      {/* Error alert if Google Maps API failed */}
      {errorMessage && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-danger-200 bg-danger-50 p-3 text-danger-700 text-xs sm:text-sm"
        >
          <AlertTriangle className="h-4 w-4 shrink-0 text-danger-600 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">Google Places Error:</span>
            <p className="mt-0.5 text-xs">{errorMessage}</p>
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

      {/* Search Input Container */}
      <div ref={containerRef} className="relative w-full">
        <label
          htmlFor="google-places-search-input"
          className="mb-1.5 block text-sm font-medium text-ink"
        >
          Search Place, Cinema, or Address *
        </label>

        <div className="relative flex w-full items-center">
          <div className="pointer-events-none absolute left-3.5 flex items-center text-ink-muted">
            <Search className="h-4 w-4" aria-hidden="true" />
          </div>

          <input
            ref={inputRef}
            id="google-places-search-input"
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isOpen}
            aria-controls="google-places-results"
            disabled={disabled || isSelecting}
            value={query}
            onChange={handleQueryChange}
            onFocus={() => {
              if (predictions.length > 0) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type theatre name, mall, or street (e.g. PVR Forum Mall, Bengaluru)..."
            autoComplete="off"
            className={cn(
              'h-11 min-h-[44px] w-full rounded-md border border-border bg-surface pl-10 pr-20',
              'text-base md:text-sm text-ink placeholder:text-ink-muted',
              'transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-ink-muted',
            )}
          />

          <div className="absolute right-2.5 flex items-center gap-1">
            {query && !disabled && !isLoading && !isSelecting && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear search query"
                className="flex h-6 w-6 items-center justify-center rounded-full text-ink-muted hover:bg-surface-muted hover:text-ink transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}

            {(isLoading || isSelecting) && (
              <div className="flex h-6 w-6 items-center justify-center text-brand-600">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
          </div>
        </div>

        <p className="mt-1 text-xs text-ink-muted">
          Selecting a Google Place automatically populates address details, city, state, postal code,
          and coordinates.
        </p>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            id="google-places-results"
            className="absolute top-[calc(100%+4px)] left-0 z-50 w-full overflow-hidden rounded-lg border border-border bg-surface shadow-xl animate-in fade-in-50 zoom-in-95 duration-100"
          >
            <ul className="max-h-64 overflow-y-auto py-1 text-sm focus:outline-none" role="listbox">
              {isLoading && predictions.length === 0 ? (
                <li className="flex items-center justify-center gap-2 px-3 py-6 text-ink-muted">
                  <Loader2 className="h-4 w-4 animate-spin text-brand-600" />
                  <span>Searching Google Places...</span>
                </li>
              ) : errorMessage ? (
                <li className="px-4 py-5 text-center text-xs text-danger-700 bg-danger-50/60">
                  <p className="font-semibold text-danger-800">Search Error</p>
                  <p className="mt-1 text-ink-muted leading-relaxed">{errorMessage}</p>
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={onSwitchToManual}
                      className="font-medium text-brand-600 hover:underline cursor-pointer"
                    >
                      Switch to manual address entry
                    </button>
                  </div>
                </li>
              ) : predictions.length === 0 ? (
                <li className="px-4 py-6 text-center text-ink-muted">
                  <p className="font-medium">No matching places found</p>
                  <p className="mt-1 text-xs text-ink-muted">
                    Try searching by landmark or mall name, or{' '}
                    <button
                      type="button"
                      onClick={onSwitchToManual}
                      className="font-medium text-brand-600 hover:underline cursor-pointer"
                    >
                      enter address manually
                    </button>
                    .
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

            {/* Google Attribution */}
            <div className="flex items-center justify-between border-t border-border bg-surface-muted/50 px-3.5 py-1.5 text-[11px] text-ink-muted">
              <span>Powered by Google Places</span>
              <button
                type="button"
                onClick={onSwitchToManual}
                className="font-medium text-brand-600 hover:underline cursor-pointer"
              >
                Can&apos;t find place? Enter manually
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GooglePlacesSearch;

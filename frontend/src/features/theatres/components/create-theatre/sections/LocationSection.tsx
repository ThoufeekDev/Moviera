import { memo } from 'react';
import { MapPin, PenTool } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { GoogleMapPicker, type ExtractedLocationDetails } from '@/shared/ui';
import { CitySelector } from './CitySelector';
import { AddressFields } from './AddressFields';

export interface LocationSectionProps {
  locationMode: 'google' | 'manual';
  onSwitchLocationMode: (mode: 'google' | 'manual') => void;
  manualCityType: 'existing' | 'new';
  onManualCityTypeChange: (type: 'existing' | 'new') => void;
  isCitiesLoading: boolean;
  cityOptions: Array<{ value: string; label: string; secondaryLabel?: string }>;
  onCityChange: (cityId: string) => void;
  onGooglePlaceSelect: (details: ExtractedLocationDetails) => void;
  selectedPlaceId?: string;
  selectedAddress?: string;
  selectedCoordinates?: { lat: number; lng: number } | null;
  disabled?: boolean;
}

export const LocationSection = memo(function LocationSection({
  locationMode,
  onSwitchLocationMode,
  manualCityType,
  onManualCityTypeChange,
  isCitiesLoading,
  cityOptions,
  onCityChange,
  onGooglePlaceSelect,
  selectedPlaceId,
  selectedAddress,
  selectedCoordinates,
  disabled,
}: LocationSectionProps) {
  return (
    <div className="rounded-lg border border-border bg-surface-muted/30 p-4">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            2. Address & Location
          </h4>
          <p className="text-xs text-ink-muted mt-0.5">
            Locate theatre on Google Map or enter address manually.
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div
          role="tablist"
          aria-label="Location Entry Method"
          className="flex items-center rounded-lg border border-border bg-surface p-1 shadow-2xs"
        >
          <button
            type="button"
            role="tab"
            id="location-tab-google"
            aria-selected={locationMode === 'google'}
            onClick={() => onSwitchLocationMode('google')}
            disabled={disabled}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer',
              locationMode === 'google'
                ? 'bg-brand-600 text-white shadow-xs font-semibold'
                : 'text-ink-muted hover:text-ink',
            )}
          >
            <MapPin className="h-3.5 w-3.5" />
            <span>Search with Google Map</span>
          </button>

          <button
            type="button"
            role="tab"
            id="location-tab-manual"
            aria-selected={locationMode === 'manual'}
            onClick={() => onSwitchLocationMode('manual')}
            disabled={disabled}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer',
              locationMode === 'manual'
                ? 'bg-brand-600 text-white shadow-xs font-semibold'
                : 'text-ink-muted hover:text-ink',
            )}
          >
            <PenTool className="h-3.5 w-3.5" />
            <span>Enter address manually</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Google Map & Places Search */}
      {locationMode === 'google' && (
        <div className="space-y-4">
          <GoogleMapPicker
            onSelectLocation={onGooglePlaceSelect}
            onSwitchToManual={() => onSwitchLocationMode('manual')}
            selectedPlaceId={selectedPlaceId}
            selectedAddress={selectedAddress}
            selectedCoordinates={selectedCoordinates}
            disabled={disabled}
          />

          {/* Editable captured address fields */}
          <div className="pt-2 border-t border-border/60">
            <AddressFields mode="google" disabled={disabled} />
          </div>
        </div>
      )}


      {/* Mode 2: Manual Address Entry */}
      {locationMode === 'manual' && (
        <div className="space-y-4">
          <CitySelector
            manualCityType={manualCityType}
            onManualCityTypeChange={onManualCityTypeChange}
            isCitiesLoading={isCitiesLoading}
            cityOptions={cityOptions}
            onCityChange={onCityChange}
            disabled={disabled}
          />

          <AddressFields mode="manual" disabled={disabled} />
        </div>
      )}
    </div>
  );
});

export default LocationSection;

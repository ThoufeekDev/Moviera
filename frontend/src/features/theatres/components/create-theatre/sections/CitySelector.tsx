import { memo } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input, Combobox } from '@/shared/ui';
import type { FormValues } from '../../../schemas/createTheatreForm.schema';
import { AreaDistrictFields } from './AddressFields';

export interface CitySelectorProps {
  manualCityType: 'existing' | 'new';
  onManualCityTypeChange: (type: 'existing' | 'new') => void;
  isCitiesLoading: boolean;
  cityOptions: Array<{ value: string; label: string; secondaryLabel?: string }>;
  onCityChange: (cityId: string) => void;
  disabled?: boolean;
}

export const CitySelector = memo(function CitySelector({
  manualCityType,
  onManualCityTypeChange,
  isCitiesLoading,
  cityOptions,
  onCityChange,
  disabled,
}: CitySelectorProps) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<FormValues>();

  return (
    <div className="rounded-md border border-border bg-surface p-3 space-y-3">
      <div className="flex items-center gap-4 text-xs font-medium text-ink">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="manualCityType"
            checked={manualCityType === 'existing'}
            onChange={() => onManualCityTypeChange('existing')}
            className="h-4 w-4 text-brand-600 focus:ring-brand-500 cursor-pointer"
          />
          <span>Select from registered operating cities</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="manualCityType"
            checked={manualCityType === 'new'}
            onChange={() => onManualCityTypeChange('new')}
            className="h-4 w-4 text-brand-600 focus:ring-brand-500 cursor-pointer"
          />
          <span>Register new city / location</span>
        </label>
      </div>

      {manualCityType === 'existing' ? (
        <Controller
          name="cityId"
          control={control}
          render={({ field, fieldState }) => (
            <Combobox
              id="theatre-city"
              label="Operating City *"
              placeholder={
                isCitiesLoading ? 'Loading cities...' : 'Search city (e.g. Kochi, Bengaluru)...'
              }
              options={cityOptions}
              value={field.value}
              onChange={(val) => {
                field.onChange(val);
                onCityChange(val);
              }}
              disabled={isCitiesLoading || disabled}
              loading={isCitiesLoading}
              loadingText="Loading operating cities..."
              noResultsText="No matching cities found. Choose 'Register new city' above."
              error={fieldState.error?.message || errors.cityId?.message || errors.cityName?.message}
              helperText="Selecting an existing city automatically maps cityId in the database"
            />
          )}
        />
      ) : (
        <div className="space-y-3 pt-1">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Input
              id="theatre-cityname-manual"
              label="City Name *"
              placeholder="e.g. Mumbai"
              disabled={disabled}
              error={errors.cityName}
              {...register('cityName')}
            />

            <Input
              id="theatre-state-manual"
              label="State *"
              placeholder="e.g. Maharashtra"
              disabled={disabled}
              error={errors.state}
              {...register('state')}
            />

            <Input
              id="theatre-country-manual"
              label="Country *"
              placeholder="e.g. India"
              disabled={disabled}
              error={errors.country}
              {...register('country')}
            />
          </div>

          <AreaDistrictFields mode="manual" disabled={disabled} />
        </div>
      )}
    </div>
  );
});

export default CitySelector;

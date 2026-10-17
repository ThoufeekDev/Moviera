import { useFormContext } from 'react-hook-form';
import { Input } from '@/shared/ui';
import { cn } from '@/shared/lib/cn';
import type { FormValues } from '../../../schemas/createTheatreForm.schema';

export interface AreaDistrictFieldsProps {
  mode: 'google' | 'manual';
  disabled?: boolean;
}

export function AreaDistrictFields({ mode, disabled }: AreaDistrictFieldsProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();
  const isGoogle = mode === 'google';

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2', isGoogle ? 'gap-4' : 'gap-3')}>
      <Input
        id={isGoogle ? 'theatre-area' : 'theatre-area-manual'}
        label="Area / Locality"
        placeholder={isGoogle ? 'e.g. Koramangala' : 'e.g. Bandra West (optional)'}
        disabled={disabled}
        error={errors.areaName}
        helperText="Sublocality or neighborhood"
        {...register('areaName')}
      />

      <Input
        id={isGoogle ? 'theatre-district' : 'theatre-district-manual'}
        label="District"
        placeholder={isGoogle ? 'e.g. Bengaluru Urban' : 'e.g. Mumbai Suburban (optional)'}
        disabled={disabled}
        error={errors.district}
        helperText="Administrative district"
        {...register('district')}
      />
    </div>
  );
}

export interface AddressFieldsProps {
  mode: 'google' | 'manual';
  disabled?: boolean;
}

export function AddressFields({ mode, disabled }: AddressFieldsProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();
  const isGoogle = mode === 'google';

  return (
    <div className="space-y-4">
      {/* Street address */}
      <Input
        id={isGoogle ? 'theatre-address' : 'theatre-address-manual'}
        label="Full Street Address *"
        placeholder={
          isGoogle
            ? 'e.g. 21 Hosur Road, 4th Block, Koramangala'
            : 'e.g. 21 Hosur Road, 4th Block'
        }
        disabled={disabled}
        error={errors.address}
        helperText={isGoogle ? 'Verified street or building address' : undefined}
        {...register('address')}
      />

      {/* Captured city/state/country fields in Google mode */}
      {isGoogle && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input
              id="theatre-cityname"
              label="City *"
              placeholder="e.g. Bengaluru"
              disabled={disabled}
              error={errors.cityName}
              {...register('cityName')}
            />

            <Input
              id="theatre-state"
              label="State *"
              placeholder="e.g. Karnataka"
              disabled={disabled}
              error={errors.state}
              {...register('state')}
            />

            <Input
              id="theatre-country"
              label="Country *"
              placeholder="e.g. India"
              disabled={disabled}
              error={errors.country}
              {...register('country')}
            />
          </div>

          <AreaDistrictFields mode="google" disabled={disabled} />
        </>
      )}

      {/* Landmark & Pincode */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          id={isGoogle ? 'theatre-landmark' : 'theatre-landmark-manual'}
          label="Landmark"
          placeholder="e.g. Opposite Forum Transit Point"
          disabled={disabled}
          error={errors.landmark}
          helperText="Optional reference landmark"
          {...register('landmark')}
        />

        <Input
          id={isGoogle ? 'theatre-pincode' : 'theatre-pincode-manual'}
          label="Pincode"
          placeholder="e.g. 560034"
          maxLength={6}
          disabled={disabled}
          error={errors.pincode}
          helperText="6-digit postal code"
          {...register('pincode')}
        />
      </div>

      {/* Coordinates */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          id={isGoogle ? 'theatre-latitude' : 'theatre-latitude-manual'}
          label="Latitude"
          placeholder="e.g. 12.9352"
          disabled={disabled}
          error={errors.latitude}
          helperText={
            isGoogle
              ? 'Geographic latitude coordinate'
              : 'Optional. Coordinate between -90 and 90'
          }
          {...register('latitude')}
        />

        <Input
          id={isGoogle ? 'theatre-longitude' : 'theatre-longitude-manual'}
          label="Longitude"
          placeholder="e.g. 77.6245"
          disabled={disabled}
          error={errors.longitude}
          helperText={
            isGoogle
              ? 'Geographic longitude coordinate'
              : 'Optional. Coordinate between -180 and 180'
          }
          {...register('longitude')}
        />
      </div>
    </div>
  );
}

export default AddressFields;

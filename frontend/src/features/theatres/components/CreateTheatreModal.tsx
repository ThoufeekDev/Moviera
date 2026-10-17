import { useState, useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import {
  AlertCircle,
  Loader2,
  Search,
  PenTool,
} from 'lucide-react';
import env from '@/shared/lib/env';
import { Modal, Input, Textarea, Button, ImageUpload, Combobox } from '@/shared/ui';
import { cn } from '@/shared/lib/cn';
import { useCities } from '../hooks/useCities';
import { useCreateTheatre } from '../hooks/useCreateTheatre';
import { ApiError } from '@/shared/lib/ApiError';
import { GooglePlacesSearch } from './GooglePlacesSearch';
import type { ExtractedPlaceDetails } from '../services/googlePlaces.service';

const clientCreateTheatreSchema = z
  .object({
    // Location identifier and resolution fields
    cityId: z.string().trim().optional().or(z.literal('')),
    cityName: z
      .string()
      .trim()
      .max(100, 'City name must not exceed 100 characters')
      .optional()
      .or(z.literal('')),
    areaName: z
      .string()
      .trim()
      .max(100, 'Area name must not exceed 100 characters')
      .optional()
      .or(z.literal('')),
    district: z
      .string()
      .trim()
      .max(100, 'District must not exceed 100 characters')
      .optional()
      .or(z.literal('')),
    state: z
      .string()
      .trim()
      .max(100, 'State must not exceed 100 characters')
      .optional()
      .or(z.literal('')),
    country: z
      .string()
      .trim()
      .max(100, 'Country must not exceed 100 characters')
      .optional()
      .or(z.literal('')),
    googlePlaceId: z.string().trim().max(255).optional().or(z.literal('')),

    // Core Theatre fields
    name: z
      .string()
      .trim()
      .min(2, 'Theatre name must be between 2 and 100 characters')
      .max(100, 'Theatre name must be between 2 and 100 characters'),
    address: z
      .string()
      .trim()
      .min(1, 'Street address is required')
      .max(500, 'Address must not exceed 500 characters'),
    description: z
      .string()
      .max(1000, 'Description must not exceed 1000 characters')
      .optional()
      .or(z.literal('')),
    email: z
      .string()
      .trim()
      .optional()
      .or(z.literal(''))
      .refine(
        (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        'Please enter a valid email address (e.g. contact@cinema.com)',
      ),
    phone: z
      .string()
      .trim()
      .optional()
      .or(z.literal(''))
      .refine(
        (val) => !val || /^(?:\+91)?[6-9]\d{9}$/.test(val),
        'Phone must be a valid 10-digit Indian number (e.g. 9876543210 or +919876543210)',
      ),
    pincode: z
      .string()
      .trim()
      .optional()
      .or(z.literal(''))
      .refine(
        (val) => !val || /^[1-9][0-9]{5}$/.test(val),
        'Pincode must be exactly 6 digits (e.g. 560001)',
      ),
    landmark: z
      .string()
      .trim()
      .max(200, 'Landmark must not exceed 200 characters')
      .optional()
      .or(z.literal('')),
    licenseNumber: z
      .string()
      .trim()
      .max(100, 'Licence number must not exceed 100 characters')
      .optional()
      .or(z.literal('')),
    latitude: z
      .string()
      .trim()
      .optional()
      .or(z.literal(''))
      .refine(
        (val) => {
          if (!val) return true;
          const num = Number(val);
          return !Number.isNaN(num) && num >= -90 && num <= 90;
        },
        'Latitude must be a number between -90 and 90',
      ),
    longitude: z
      .string()
      .trim()
      .optional()
      .or(z.literal(''))
      .refine(
        (val) => {
          if (!val) return true;
          const num = Number(val);
          return !Number.isNaN(num) && num >= -180 && num <= 180;
        },
        'Longitude must be a number between -180 and 180',
      ),
    isActive: z.boolean(),
  })
  .refine(
    (data) => {
      const hasLat = Boolean(data.latitude && data.latitude.trim() !== '');
      const hasLng = Boolean(data.longitude && data.longitude.trim() !== '');
      return (hasLat && hasLng) || (!hasLat && !hasLng);
    },
    {
      message: 'Latitude and longitude must both be provided together, or both omitted.',
      path: ['latitude'],
    },
  )
  .refine(
    (data) => {
      // Either select an existing city OR provide cityName, state, and country
      const hasCityId = Boolean(data.cityId && data.cityId.trim() !== '');
      const hasCityDetails = Boolean(
        data.cityName &&
          data.cityName.trim() !== '' &&
          data.state &&
          data.state.trim() !== '' &&
          data.country &&
          data.country.trim() !== '',
      );

      return hasCityId || hasCityDetails;
    },
    {
      message: 'Select an existing city or provide City Name, State, and Country.',
      path: ['cityName'],
    },
  );

type FormValues = z.infer<typeof clientCreateTheatreSchema>;

export interface CreateTheatreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTheatreModal({ isOpen, onClose }: CreateTheatreModalProps) {
  // Location selection mode: 'google' | 'manual'
  const hasGoogleApiKey = Boolean(env.googleMapsApiKey && env.googleMapsApiKey.trim() !== '');
  const [locationMode, setLocationMode] = useState<'google' | 'manual'>(
    hasGoogleApiKey ? 'google' : 'manual',
  );

  // In manual mode, whether using an existing registered city or registering a new one
  const [manualCityType, setManualCityType] = useState<'existing' | 'new'>('existing');

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const { data: cities = [], isLoading: isCitiesLoading } = useCities();
  const createTheatreMutation = useCreateTheatre();

  const cityOptions = useMemo(
    () =>
      cities.map((city) => ({
        value: city.id,
        label: city.name,
        secondaryLabel: city.state,
      })),
    [cities],
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    setError,
    clearErrors,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(clientCreateTheatreSchema),
    defaultValues: {
      cityId: '',
      cityName: '',
      areaName: '',
      district: '',
      state: '',
      country: 'India',
      googlePlaceId: '',
      name: '',
      address: '',
      description: '',
      email: '',
      phone: '',
      pincode: '',
      landmark: '',
      licenseNumber: '',
      latitude: '',
      longitude: '',
      isActive: true,
    },
  });

  const watchedCityId = watch('cityId');
  const watchedAddress = watch('address');
  const watchedGooglePlaceId = watch('googlePlaceId');

  // Sync city selection: when user picks an existing city, keep its state
  useEffect(() => {
    if (watchedCityId) {
      const match = cities.find((c) => c.id === watchedCityId);
      if (match) {
        setValue('cityName', match.name, { shouldValidate: true });
        if (match.state) {
          setValue('state', match.state, { shouldValidate: true });
        }
        setValue('country', 'India', { shouldValidate: true });
      }
    }
  }, [watchedCityId, cities, setValue]);

  const handleClose = () => {
    reset();
    setLogoFile(null);
    setLogoError(null);
    setServerError(null);
    setLocationMode(hasGoogleApiKey ? 'google' : 'manual');
    setManualCityType('existing');
    onClose();
  };

  const handleLogoSelect = (file: File) => {
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setLogoError('Logo image file must be less than 5 MB');
      return;
    }
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setLogoError('Logo must be a JPG, PNG, or WebP image');
      return;
    }

    setLogoError(null);
    setLogoFile(file);
  };

  /**
   * Called when the administrator selects a place in Google Places mode.
   * Extracts location fields and populates the form without overwriting unchanged manual inputs.
   */
  const handleGooglePlaceSelect = (details: ExtractedPlaceDetails) => {
    clearErrors(['address', 'cityName', 'state', 'country', 'latitude', 'longitude']);

    if (details.address) {
      setValue('address', details.address, { shouldValidate: true });
    }

    // Auto-fill theatre name if currently empty
    const currentName = getValues('name');
    if ((!currentName || currentName.trim() === '') && details.name) {
      setValue('name', details.name, { shouldValidate: true });
    }

    if (details.cityName) {
      setValue('cityName', details.cityName, { shouldValidate: true });
      // If city matches an existing city in database, link cityId as well
      const matchedCity = cities.find(
        (c) => c.name.toLowerCase() === details.cityName?.toLowerCase(),
      );
      if (matchedCity) {
        setValue('cityId', matchedCity.id);
      } else {
        setValue('cityId', '');
      }
    }

    if (details.areaName) {
      setValue('areaName', details.areaName);
    }
    if (details.district) {
      setValue('district', details.district);
    }
    if (details.state) {
      setValue('state', details.state, { shouldValidate: true });
    }
    if (details.country) {
      setValue('country', details.country, { shouldValidate: true });
    }
    if (details.pincode) {
      setValue('pincode', details.pincode, { shouldValidate: true });
    }
    if (details.latitude !== undefined && details.latitude !== null) {
      setValue('latitude', String(details.latitude), { shouldValidate: true });
    }
    if (details.longitude !== undefined && details.longitude !== null) {
      setValue('longitude', String(details.longitude), { shouldValidate: true });
    }
    if (details.googlePlaceId) {
      setValue('googlePlaceId', details.googlePlaceId);
    }
  };

  /**
   * Switch location selection mode while strictly preserving useful populated values.
   */
  const handleSwitchLocationMode = (mode: 'google' | 'manual') => {
    setLocationMode(mode);
    setServerError(null);

    // If switching to manual and we already have a custom city populated, ensure 'new' tab is selected
    if (mode === 'manual') {
      const currentCityId = getValues('cityId');
      const currentCityName = getValues('cityName');
      if (!currentCityId && currentCityName) {
        setManualCityType('new');
      }
    }
  };

  const onSubmit = async (values: FormValues) => {
    setServerError(null);

    const latNumber =
      values.latitude && values.latitude.trim() !== '' ? Number(values.latitude) : null;
    const lngNumber =
      values.longitude && values.longitude.trim() !== '' ? Number(values.longitude) : null;

    // Build payload according to backend rules
    const hasLat = latNumber !== null && !Number.isNaN(latNumber);
    const hasLng = lngNumber !== null && !Number.isNaN(lngNumber);

    const payload = {
      name: values.name.trim(),
      address: values.address.trim(),
      description: values.description?.trim() || undefined,
      email: values.email?.trim().toLowerCase() || undefined,
      phone: values.phone?.trim() || undefined,
      pincode: values.pincode?.trim() || undefined,
      landmark: values.landmark?.trim() || undefined,
      licenseNumber: values.licenseNumber?.trim() || undefined,
      latitude: hasLat && hasLng ? latNumber : null,
      longitude: hasLat && hasLng ? lngNumber : null,
      isActive: values.isActive,
      logo: logoFile,
      cityId: values.cityId && values.cityId.trim() !== '' ? values.cityId.trim() : undefined,
      cityName:
        !values.cityId && values.cityName && values.cityName.trim() !== ''
          ? values.cityName.trim()
          : undefined,
      state:
        !values.cityId && values.state && values.state.trim() !== ''
          ? values.state.trim()
          : undefined,
      country:
        !values.cityId && values.country && values.country.trim() !== ''
          ? values.country.trim()
          : undefined,
      areaName: values.areaName && values.areaName.trim() !== '' ? values.areaName.trim() : undefined,
      district: values.district && values.district.trim() !== '' ? values.district.trim() : undefined,
      // Google Place ID is sent ONLY when Google Places was selected
      googlePlaceId:
        locationMode === 'google' && values.googlePlaceId && values.googlePlaceId.trim() !== ''
          ? values.googlePlaceId.trim()
          : undefined,
    };

    try {
      await createTheatreMutation.mutateAsync(payload);
      toast.success('Theatre created successfully!');
      handleClose();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Failed to create theatre. Please check the inputs and try again.';

      const lowerMsg = errorMessage.toLowerCase();
      if (lowerMsg.includes('name')) {
        setError('name', { type: 'server', message: errorMessage });
      } else if (lowerMsg.includes('licence') || lowerMsg.includes('license')) {
        setError('licenseNumber', { type: 'server', message: errorMessage });
      } else if (lowerMsg.includes('city')) {
        if (values.cityId) {
          setError('cityId', { type: 'server', message: errorMessage });
        } else {
          setError('cityName', { type: 'server', message: errorMessage });
        }
      } else {
        setServerError(errorMessage);
      }
    }
  };

  const isPending = isSubmitting || createTheatreMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={isPending ? () => {} : handleClose}
      title="Create New Theatre"
      description="Register a new cinema multiplex or single screen theatre."
      size="xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {serverError && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-lg border border-danger-200 bg-danger-50 p-3.5 text-danger-700"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger-600" />
            <div className="text-sm">
              <span className="font-semibold">Unable to register theatre:</span>
              <p className="mt-0.5">{serverError}</p>
            </div>
          </div>
        )}

        {/* Section 1: Basic Information */}
        <div className="rounded-lg border border-border bg-surface-muted/30 p-4">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">
            1. Basic Information
          </h4>
          <div className="space-y-4">
            <Input
              id="theatre-name"
              label="Theatre Name *"
              placeholder="e.g. PVR: Forum Mall, Koramangala"
              disabled={isPending}
              error={errors.name}
              {...register('name')}
            />

            <Textarea
              id="theatre-description"
              label="Description / Amenities Overview"
              placeholder="Brief summary of screen experiences, Dolby Atmos support, parking, accessibility, etc."
              rows={2}
              disabled={isPending}
              error={errors.description?.message}
              {...register('description')}
            />
          </div>
        </div>

        {/* Section 2: Address & Location with Google Places vs Manual Selection */}
        <div className="rounded-lg border border-border bg-surface-muted/30 p-4">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                2. Address & Location
              </h4>
              <p className="text-xs text-ink-muted mt-0.5">
                Choose how you want to locate and enter theatre address details.
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
                onClick={() => handleSwitchLocationMode('google')}
                disabled={isPending}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer',
                  locationMode === 'google'
                    ? 'bg-brand-600 text-white shadow-xs font-semibold'
                    : 'text-ink-muted hover:text-ink',
                )}
              >
                <Search className="h-3.5 w-3.5" />
                <span>Search with Google Places</span>
              </button>

              <button
                type="button"
                role="tab"
                id="location-tab-manual"
                aria-selected={locationMode === 'manual'}
                onClick={() => handleSwitchLocationMode('manual')}
                disabled={isPending}
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

          {/* Mode 1: Google Places Search */}
          {locationMode === 'google' && (
            <div className="space-y-4">
              <GooglePlacesSearch
                onSelectPlace={handleGooglePlaceSelect}
                onSwitchToManual={() => handleSwitchLocationMode('manual')}
                selectedPlaceId={watchedGooglePlaceId}
                selectedAddress={watchedAddress}
                disabled={isPending}
              />

              {/* Editable captured address fields */}
              <div className="pt-2 border-t border-border/60 space-y-4">
                <Input
                  id="theatre-address"
                  label="Full Street Address *"
                  placeholder="e.g. 21 Hosur Road, 4th Block, Koramangala"
                  disabled={isPending}
                  error={errors.address}
                  helperText="Verified street or building address"
                  {...register('address')}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Input
                    id="theatre-cityname"
                    label="City *"
                    placeholder="e.g. Bengaluru"
                    disabled={isPending}
                    error={errors.cityName}
                    {...register('cityName')}
                  />

                  <Input
                    id="theatre-state"
                    label="State *"
                    placeholder="e.g. Karnataka"
                    disabled={isPending}
                    error={errors.state}
                    {...register('state')}
                  />

                  <Input
                    id="theatre-country"
                    label="Country *"
                    placeholder="e.g. India"
                    disabled={isPending}
                    error={errors.country}
                    {...register('country')}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    id="theatre-area"
                    label="Area / Locality"
                    placeholder="e.g. Koramangala"
                    disabled={isPending}
                    error={errors.areaName}
                    helperText="Sublocality or neighborhood"
                    {...register('areaName')}
                  />

                  <Input
                    id="theatre-district"
                    label="District"
                    placeholder="e.g. Bengaluru Urban"
                    disabled={isPending}
                    error={errors.district}
                    helperText="Administrative district"
                    {...register('district')}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    id="theatre-landmark"
                    label="Landmark"
                    placeholder="e.g. Opposite Forum Transit Point"
                    disabled={isPending}
                    error={errors.landmark}
                    helperText="Optional reference landmark"
                    {...register('landmark')}
                  />

                  <Input
                    id="theatre-pincode"
                    label="Pincode"
                    placeholder="e.g. 560034"
                    maxLength={6}
                    disabled={isPending}
                    error={errors.pincode}
                    helperText="6-digit postal code"
                    {...register('pincode')}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    id="theatre-latitude"
                    label="Latitude"
                    placeholder="e.g. 12.9352"
                    disabled={isPending}
                    error={errors.latitude}
                    helperText="Geographic latitude coordinate"
                    {...register('latitude')}
                  />

                  <Input
                    id="theatre-longitude"
                    label="Longitude"
                    placeholder="e.g. 77.6245"
                    disabled={isPending}
                    error={errors.longitude}
                    helperText="Geographic longitude coordinate"
                    {...register('longitude')}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Manual Address Entry */}
          {locationMode === 'manual' && (
            <div className="space-y-4">
              {/* City Selection Options: Existing vs New */}
              <div className="rounded-md border border-border bg-surface p-3 space-y-3">
                <div className="flex items-center gap-4 text-xs font-medium text-ink">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="manualCityType"
                      checked={manualCityType === 'existing'}
                      onChange={() => {
                        setManualCityType('existing');
                        clearErrors(['cityName', 'cityId']);
                      }}
                      className="h-4 w-4 text-brand-600 focus:ring-brand-500 cursor-pointer"
                    />
                    <span>Select from registered operating cities</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="manualCityType"
                      checked={manualCityType === 'new'}
                      onChange={() => {
                        setManualCityType('new');
                        setValue('cityId', '');
                        clearErrors(['cityName', 'cityId']);
                      }}
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
                          const chosen = cities.find((c) => c.id === val);
                          if (chosen) {
                            setValue('cityName', chosen.name);
                            if (chosen.state) setValue('state', chosen.state);
                            setValue('country', 'India');
                          }
                        }}
                        disabled={isCitiesLoading || isPending}
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
                        disabled={isPending}
                        error={errors.cityName}
                        {...register('cityName')}
                      />

                      <Input
                        id="theatre-state-manual"
                        label="State *"
                        placeholder="e.g. Maharashtra"
                        disabled={isPending}
                        error={errors.state}
                        {...register('state')}
                      />

                      <Input
                        id="theatre-country-manual"
                        label="Country *"
                        placeholder="e.g. India"
                        disabled={isPending}
                        error={errors.country}
                        {...register('country')}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <Input
                        id="theatre-area-manual"
                        label="Area / Locality"
                        placeholder="e.g. Bandra West (optional)"
                        disabled={isPending}
                        error={errors.areaName}
                        helperText="Sublocality or neighborhood"
                        {...register('areaName')}
                      />

                      <Input
                        id="theatre-district-manual"
                        label="District"
                        placeholder="e.g. Mumbai Suburban (optional)"
                        disabled={isPending}
                        error={errors.district}
                        helperText="Administrative district"
                        {...register('district')}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Full street address */}
              <Input
                id="theatre-address-manual"
                label="Full Street Address *"
                placeholder="e.g. 21 Hosur Road, 4th Block"
                disabled={isPending}
                error={errors.address}
                {...register('address')}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  id="theatre-landmark-manual"
                  label="Landmark"
                  placeholder="e.g. Opposite Forum Transit Point"
                  disabled={isPending}
                  error={errors.landmark}
                  helperText="Optional reference landmark"
                  {...register('landmark')}
                />

                <Input
                  id="theatre-pincode-manual"
                  label="Pincode"
                  placeholder="e.g. 560034"
                  maxLength={6}
                  disabled={isPending}
                  error={errors.pincode}
                  helperText="6-digit postal code"
                  {...register('pincode')}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  id="theatre-latitude-manual"
                  label="Latitude"
                  placeholder="e.g. 12.9352"
                  disabled={isPending}
                  error={errors.latitude}
                  helperText="Optional. Coordinate between -90 and 90"
                  {...register('latitude')}
                />

                <Input
                  id="theatre-longitude-manual"
                  label="Longitude"
                  placeholder="e.g. 77.6245"
                  disabled={isPending}
                  error={errors.longitude}
                  helperText="Optional. Coordinate between -180 and 180"
                  {...register('longitude')}
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Contact & Legal Details */}
        <div className="rounded-lg border border-border bg-surface-muted/30 p-4">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">
            3. Contact & Licence
          </h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input
              id="theatre-email"
              type="email"
              label="Contact Email"
              placeholder="e.g. help@pvrcinemas.com"
              disabled={isPending}
              error={errors.email}
              {...register('email')}
            />

            <Input
              id="theatre-phone"
              type="tel"
              label="Contact Phone"
              placeholder="e.g. +919876543210"
              disabled={isPending}
              error={errors.phone}
              {...register('phone')}
            />

            <Input
              id="theatre-license"
              label="Licence Number"
              placeholder="e.g. LIC-KA-2024-897"
              disabled={isPending}
              error={errors.licenseNumber}
              helperText="Unique regulatory theatre license"
              {...register('licenseNumber')}
            />
          </div>
        </div>

        {/* Section 4: Branding & Operational Status */}
        <div className="rounded-lg border border-border bg-surface-muted/30 p-4">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">
            4. Media & Operational Status
          </h4>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <ImageUpload
                id="theatre-logo"
                label="Theatre Logo"
                aspect={1}
                aspectLabel="1:1 Square"
                onImageSelect={handleLogoSelect}
                onImageRemove={() => {
                  setLogoFile(null);
                  setLogoError(null);
                }}
                error={logoError || undefined}
                className="max-w-xs"
              />
            </div>

            <div className="flex flex-col justify-center gap-3">
              <label className="text-sm font-medium text-ink">Theatre Active State</label>
              <div className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3.5 shadow-xs">
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <input
                      id="theatre-active-toggle"
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      disabled={isPending}
                      className="h-5 w-5 rounded border-border text-brand-600 focus:ring-brand-500 cursor-pointer"
                    />
                  )}
                />
                <label htmlFor="theatre-active-toggle" className="text-xs text-ink cursor-pointer">
                  <span className="font-semibold block">Active and available</span>
                  <span className="text-ink-muted">
                    When active, administrators can configure screens and schedules.
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleClose}
            disabled={isPending}
            className="cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isPending}
            className="min-w-[130px] flex items-center justify-center gap-2 cursor-pointer font-medium"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <span>Create Theatre</span>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

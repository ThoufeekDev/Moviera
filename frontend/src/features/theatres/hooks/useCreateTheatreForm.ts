import { useState, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import env from '@/shared/lib/env';
import { useCities } from './useCities';
import { useCreateTheatre } from './useCreateTheatre';
import type { ExtractedPlaceDetails } from '../services/googlePlaces.service';
import {
  clientCreateTheatreSchema,
  defaultCreateTheatreFormValues,
  type FormValues,
} from '../schemas/createTheatreForm.schema';
import { buildCreateTheatrePayload } from '../utils/buildCreateTheatrePayload';
import { mapServerErrorToField } from '../utils/mapServerErrorToField';

export interface UseCreateTheatreFormOptions {
  onClose: () => void;
  onSuccess?: (theatreName: string) => void;
}

export function useCreateTheatreForm({ onClose, onSuccess }: UseCreateTheatreFormOptions) {
  const hasGoogleApiKey = Boolean(env.googleMapsApiKey && env.googleMapsApiKey.trim() !== '');
  const [locationMode, setLocationMode] = useState<'google' | 'manual'>(
    hasGoogleApiKey ? 'google' : 'manual',
  );

  // In manual mode, whether using an existing registered city or registering a new one
  const [manualCityType, setManualCityType] = useState<'existing' | 'new'>('existing');

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  // Track chosen Google Place for confirmation badge without listening to live keystrokes
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>('');
  const [selectedPlaceAddress, setSelectedPlaceAddress] = useState<string>('');
  const [selectedCoordinates, setSelectedCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

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

  // Optimized React Hook Form configuration:
  // - mode: 'onTouched' and reValidateMode: 'onBlur' prevents the expensive Zod schema from running on every keystroke
  // - No watch() subscriptions are registered on live text fields, avoiding top-level modal re-renders while typing
  const form = useForm<FormValues>({
    resolver: zodResolver(clientCreateTheatreSchema),
    defaultValues: defaultCreateTheatreFormValues,
    mode: 'onTouched',
    reValidateMode: 'onBlur',
  });

  const {
    handleSubmit,
    setValue,
    getValues,
    setError,
    clearErrors,
    reset,
    formState: { isSubmitting },
  } = form;

  const handleClose = useCallback(() => {
    reset();
    setLogoFile(null);
    setLogoError(null);
    setServerError(null);
    setSelectedPlaceId('');
    setSelectedPlaceAddress('');
    setSelectedCoordinates(null);
    setLocationMode(hasGoogleApiKey ? 'google' : 'manual');
    setManualCityType('existing');
    onClose();
  }, [reset, hasGoogleApiKey, onClose]);

  const handleLogoSelect = useCallback((file: File) => {
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
  }, []);

  const handleLogoRemove = useCallback(() => {
    setLogoFile(null);
    setLogoError(null);
  }, []);

  /**
   * Called when the administrator selects a place in Google Places mode.
   * Extracts location fields and populates the form without overwriting unchanged manual inputs.
   */
  const handleGooglePlaceSelect = useCallback(
    (details: ExtractedPlaceDetails) => {
      clearErrors(['address', 'cityName', 'state', 'country', 'latitude', 'longitude']);

      if (details.googlePlaceId) {
        setSelectedPlaceId(details.googlePlaceId);
        setValue('googlePlaceId', details.googlePlaceId);
      }
      if (details.address) {
        setSelectedPlaceAddress(details.address);
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
      if (
        details.latitude !== undefined &&
        details.latitude !== null &&
        details.longitude !== undefined &&
        details.longitude !== null
      ) {
        setSelectedCoordinates({ lat: details.latitude, lng: details.longitude });
        setValue('latitude', String(details.latitude), { shouldValidate: true });
        setValue('longitude', String(details.longitude), { shouldValidate: true });
      } else {
        if (details.latitude !== undefined && details.latitude !== null) {
          setValue('latitude', String(details.latitude), { shouldValidate: true });
        }
        if (details.longitude !== undefined && details.longitude !== null) {
          setValue('longitude', String(details.longitude), { shouldValidate: true });
        }
      }
    },
    [clearErrors, setValue, getValues, cities],
  );

  /**
   * Switch location selection mode while strictly preserving useful populated values.
   */
  const handleSwitchLocationMode = useCallback(
    (mode: 'google' | 'manual') => {
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
    },
    [getValues],
  );

  const handleManualCityTypeChange = useCallback(
    (type: 'existing' | 'new') => {
      setManualCityType(type);
      if (type === 'new') {
        setValue('cityId', '');
      }
      clearErrors(['cityName', 'cityId']);
    },
    [setValue, clearErrors],
  );

  const handleCityChange = useCallback(
    (val: string) => {
      const chosen = cities.find((c) => c.id === val);
      if (chosen) {
        setValue('cityName', chosen.name);
        if (chosen.state) setValue('state', chosen.state);
        setValue('country', 'India');
      }
    },
    [cities, setValue],
  );

  const onSubmit = useCallback(
    async (values: FormValues) => {
      setServerError(null);

      const payload = buildCreateTheatrePayload(values, {
        logoFile,
        locationMode,
      });

      try {
        await createTheatreMutation.mutateAsync(payload);
        handleClose();
        if (onSuccess) {
          onSuccess(values.name);
        } else {
          toast.success('Theatre created successfully!');
        }
      } catch (err: unknown) {
        const mapped = mapServerErrorToField(err, values);
        if (mapped.field) {
          setError(mapped.field, { type: 'server', message: mapped.message });
        } else if (mapped.serverError) {
          setServerError(mapped.serverError);
        }
      }
    },
    [logoFile, locationMode, createTheatreMutation, handleClose, onSuccess, setError],
  );

  const isPending = isSubmitting || createTheatreMutation.isPending;

  return {
    form,
    locationMode,
    manualCityType,
    setManualCityType: handleManualCityTypeChange,
    logoFile,
    logoError,
    serverError,
    cities,
    isCitiesLoading,
    cityOptions,
    selectedPlaceId,
    selectedPlaceAddress,
    selectedCoordinates,
    isPending,
    handleClose,
    handleLogoSelect,
    handleLogoRemove,
    handleGooglePlaceSelect,
    handleSwitchLocationMode,
    handleCityChange,
    handleSubmit: handleSubmit(onSubmit),
  };
}

export default useCreateTheatreForm;

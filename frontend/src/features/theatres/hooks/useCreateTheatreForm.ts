import { useState, useMemo, useEffect } from 'react';
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

  const form = useForm<FormValues>({
    resolver: zodResolver(clientCreateTheatreSchema),
    defaultValues: defaultCreateTheatreFormValues,
  });

  const {
    handleSubmit,
    setValue,
    getValues,
    setError,
    clearErrors,
    reset,
    watch,
    formState: { isSubmitting },
  } = form;

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

  const handleLogoRemove = () => {
    setLogoFile(null);
    setLogoError(null);
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

  const handleManualCityTypeChange = (type: 'existing' | 'new') => {
    setManualCityType(type);
    if (type === 'new') {
      setValue('cityId', '');
    }
    clearErrors(['cityName', 'cityId']);
  };

  const handleCityChange = (val: string) => {
    const chosen = cities.find((c) => c.id === val);
    if (chosen) {
      setValue('cityName', chosen.name);
      if (chosen.state) setValue('state', chosen.state);
      setValue('country', 'India');
    }
  };

  const onSubmit = async (values: FormValues) => {
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
  };

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
    watchedGooglePlaceId,
    watchedAddress,
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

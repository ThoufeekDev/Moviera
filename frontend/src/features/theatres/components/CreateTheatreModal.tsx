import { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Modal, Input, Textarea, Button, ImageUpload, Combobox } from '@/shared/ui';
import { useCities } from '../hooks/useCities';
import { useCreateTheatre } from '../hooks/useCreateTheatre';
import { ApiError } from '@/shared/lib/ApiError';

const clientCreateTheatreSchema = z
  .object({
    cityId: z.string().trim().min(1, 'Please select a city'),
    name: z
      .string()
      .trim()
      .min(2, 'Theatre name must be between 2 and 100 characters')
      .max(100, 'Theatre name must be between 2 and 100 characters'),
    address: z
      .string()
      .trim()
      .min(1, 'Address is required')
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
  );

type FormValues = z.infer<typeof clientCreateTheatreSchema>;

export interface CreateTheatreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTheatreModal({ isOpen, onClose }: CreateTheatreModalProps) {
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
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(clientCreateTheatreSchema),
    defaultValues: {
      cityId: '',
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

  const handleClose = () => {
    reset();
    setLogoFile(null);
    setLogoError(null);
    setServerError(null);
    onClose();
  };

  const handleLogoSelect = (file: File) => {
    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setLogoError('Logo image file must be less than 2 MB');
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

  const onSubmit = async (values: FormValues) => {
    setServerError(null);

    const latNumber = values.latitude && values.latitude.trim() !== '' ? Number(values.latitude) : null;
    const lngNumber = values.longitude && values.longitude.trim() !== '' ? Number(values.longitude) : null;

    try {
      await createTheatreMutation.mutateAsync({
        cityId: values.cityId,
        name: values.name.trim(),
        address: values.address.trim(),
        description: values.description?.trim() || undefined,
        email: values.email?.trim().toLowerCase() || undefined,
        phone: values.phone?.trim() || undefined,
        pincode: values.pincode?.trim() || undefined,
        landmark: values.landmark?.trim() || undefined,
        licenseNumber: values.licenseNumber?.trim() || undefined,
        latitude: latNumber,
        longitude: lngNumber,
        isActive: values.isActive,
        logo: logoFile,
      });

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
        setError('cityId', { type: 'server', message: errorMessage });
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

        {/* Section 1: Core Identification */}
        <div className="rounded-lg border border-border bg-surface-muted/30 p-4">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">
            1. Basic Information
          </h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Controller
              name="cityId"
              control={control}
              render={({ field, fieldState }) => (
                <Combobox
                  id="theatre-city"
                  label="City *"
                  placeholder={
                    isCitiesLoading ? 'Loading cities...' : 'Search city (e.g. Kochi, Mumbai)...'
                  }
                  options={cityOptions}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isCitiesLoading || isPending}
                  loading={isCitiesLoading}
                  loadingText="Loading operating cities..."
                  noResultsText="No matching cities found"
                  error={fieldState.error?.message || errors.cityId?.message}
                  helperText="Search by city name or state to prevent wrong picks"
                />
              )}
            />

            <Input
              id="theatre-name"
              label="Theatre Name *"
              placeholder="e.g. PVR: Forum Mall, Koramangala"
              disabled={isPending}
              error={errors.name}
              {...register('name')}
            />
          </div>
        </div>

        {/* Section 2: Address & Location */}
        <div className="rounded-lg border border-border bg-surface-muted/30 p-4">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">
            2. Address & Location
          </h4>
          <div className="space-y-4">
            <Input
              id="theatre-address"
              label="Full Address *"
              placeholder="e.g. 21 Hosur Road, 4th Block, Koramangala"
              disabled={isPending}
              error={errors.address}
              {...register('address')}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                id="theatre-landmark"
                label="Landmark"
                placeholder="e.g. Opposite Forum Transit Point"
                disabled={isPending}
                error={errors.landmark}
                helperText="Optional reference point"
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
                helperText="Optional. Can be added later by the theatre admin"
                {...register('latitude')}
              />

              <Input
                id="theatre-longitude"
                label="Longitude"
                placeholder="e.g. 77.6245"
                disabled={isPending}
                error={errors.longitude}
                helperText="Optional. Can be added later by the theatre admin"
                {...register('longitude')}
              />
            </div>
          </div>
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

          <div className="mt-4">
            <Textarea
              id="theatre-description"
              label="Description / Amenities Overview"
              placeholder="Brief summary of screen experiences, Dolby Atmos support, parking, etc."
              rows={3}
              disabled={isPending}
              error={errors.description?.message}
              {...register('description')}
            />
          </div>
        </div>

        {/* Section 4: Branding & Status */}
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

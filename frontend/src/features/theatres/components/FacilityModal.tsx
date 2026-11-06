import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Modal,
  Button,
  Input,
  Textarea,
  FormErrorBanner,
} from '@/shared/ui';
import {
  ALLOWED_FACILITY_ICON_KEYS,
  FACILITY_ICON_LABELS,
  FACILITY_ICON_REGISTRY,
  FacilityIcon,
  type FacilityIconKey,
} from '../icons/facilityIcons';
import { useCreateFacility } from '../hooks/useCreateFacility';
import { useEditFacility } from '../hooks/useEditFacility';
import type { SuperAdminFacilityItem } from '../api/facilities.api';
import { setFormServerErrors } from '@/shared/lib/formErrors';
import {
  facilityFormSchema,
  type FacilityFormData,
} from '../schemas/facilityForm.schema';
import { cn } from '@/shared/lib/cn';
import { Sparkles } from 'lucide-react';

export interface FacilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  facility?: SuperAdminFacilityItem | null;
  onSuccess?: (facilityName: string, isEditing: boolean) => void;
}

export default function FacilityModal({
  isOpen,
  onClose,
  facility,
  onSuccess,
}: FacilityModalProps) {
  const isEditing = Boolean(facility);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const createMutation = useCreateFacility();
  const editMutation = useEditFacility();

  const isSubmitting = createMutation.isPending || editMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    control,
    formState: { errors },
  } = useForm<FacilityFormData>({
    resolver: zodResolver(facilityFormSchema),
    defaultValues: {
      name: '',
      description: '',
      iconKey: null,
    },
  });

  const watchedName = useWatch({ control, name: 'name' }) || '';
  const watchedDescription = useWatch({ control, name: 'description' }) || '';
  const watchedIconKey = useWatch({ control, name: 'iconKey' });

  // Populate or reset form whenever isOpen or facility changes
  useEffect(() => {
    if (isOpen) {
      if (facility) {
        reset({
          name: facility.name,
          description: facility.description ?? '',
          iconKey:
            facility.iconKey && ALLOWED_FACILITY_ICON_KEYS.includes(facility.iconKey as FacilityIconKey)
              ? (facility.iconKey as FacilityIconKey)
              : null,
        });
      } else {
        reset({
          name: '',
          description: '',
          iconKey: null,
        });
      }
      setGeneralError(null);
    }
  }, [isOpen, facility, reset]);

  const onSubmit = async (data: FacilityFormData) => {
    setGeneralError(null);

    const payload = {
      name: data.name.trim().replace(/\s+/g, ' '),
      description: data.description?.trim() || null,
      iconKey: data.iconKey || null,
    };

    try {
      if (isEditing && facility) {
        await editMutation.mutateAsync({
          id: facility.id,
          data: payload,
        });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onClose();
      if (onSuccess) {
        onSuccess(payload.name, isEditing);
      }
    } catch (error) {
      const result = setFormServerErrors(setError, error);
      setGeneralError(result.generalMessage);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isSubmitting) onClose();
      }}
      title={isEditing ? 'Edit Facility' : 'Create New Facility'}
      description={
        isEditing
          ? 'Update the master configuration, icon, or description for this facility.'
          : 'Define a new theatre facility that multiplexes and theatre halls can feature.'
      }
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
        {/* General Error Alert */}
        <FormErrorBanner message={generalError} />

        {/* Name Field */}
        <div className="flex flex-col gap-1.5">
          <Input
            id="facility-name"
            label="Facility Name *"
            placeholder="e.g. VIP Lounge, Valet Parking, Food Court"
            disabled={isSubmitting}
            maxLength={60}
            error={errors.name?.message}
            helperText={
              !errors.name
                ? 'Must be unique, 2 to 60 characters. A web-friendly slug will be automatically created.'
                : undefined
            }
            autoFocus
            {...register('name', {
              onChange: () => {
                if (generalError) setGeneralError(null);
              },
            })}
          />
        </div>

        {/* Description Field */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-muted">Max 300 characters</span>
            <span
              className={cn(
                'text-xs tabular-nums',
                watchedDescription.length > 280 ? 'font-semibold text-amber-600' : 'text-ink-muted',
              )}
            >
              {watchedDescription.length} / 300
            </span>
          </div>
          <Textarea
            id="facility-description"
            label="Description (Optional)"
            rows={3}
            placeholder="Brief explanation of what this facility provides to theatre visitors..."
            disabled={isSubmitting}
            maxLength={300}
            error={errors.description?.message}
            {...register('description', {
              onChange: () => {
                if (generalError) setGeneralError(null);
              },
            })}
          />
        </div>

        {/* Icon Picker Section with Live Preview */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-ink">
              Facility Icon <span className="text-xs font-normal text-ink-muted">(Optional)</span>
            </span>
            {watchedIconKey && (
              <button
                type="button"
                onClick={() => setValue('iconKey', null, { shouldDirty: true })}
                className="text-xs font-medium text-brand-600 hover:text-brand-700 hover:underline cursor-pointer"
              >
                Clear selection
              </button>
            )}
          </div>

          {/* Live Preview Bar */}
          <div className="flex items-center gap-3 rounded-lg border border-border/80 bg-surface-muted/50 p-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-surface border border-border shadow-xs text-brand-600">
              <FacilityIcon iconKey={watchedIconKey as FacilityIconKey | null} size={22} />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-ink">
                  {watchedIconKey ? FACILITY_ICON_LABELS[watchedIconKey as FacilityIconKey] : 'Default Fallback Icon'}
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-semibold text-brand-700">
                  <Sparkles size={10} /> Live Preview
                </span>
              </div>
              <p className="text-xs text-ink-muted truncate">
                {watchedName.trim() || 'Facility Name Preview'}
                {watchedIconKey ? ` • Key: ${watchedIconKey}` : ' • Neutral fallback icon will be used'}
              </p>
            </div>
          </div>

          {/* Icon Selector Grid */}
          <div
            role="radiogroup"
            aria-label="Select facility icon"
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2"
          >
            {ALLOWED_FACILITY_ICON_KEYS.map((key) => {
              const isSelected = watchedIconKey === key;
              const IconComp = FACILITY_ICON_REGISTRY[key];
              const label = FACILITY_ICON_LABELS[key];

              return (
                <button
                  key={key}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() =>
                    setValue('iconKey', isSelected ? null : key, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  className={cn(
                    'flex flex-col items-center justify-center gap-1.5 rounded-lg border p-2.5 text-center transition-all cursor-pointer select-none',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-1',
                    isSelected
                      ? 'border-brand-600 bg-brand-50/70 text-brand-700 font-semibold shadow-xs ring-1 ring-brand-600/30'
                      : 'border-border bg-surface text-ink hover:border-brand-300 hover:bg-surface-muted',
                  )}
                  title={`Select ${label} icon`}
                >
                  <IconComp className={cn('h-5 w-5', isSelected ? 'text-brand-600' : 'text-ink-muted')} />
                  <span className="text-[11px] leading-tight line-clamp-1 w-full">
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSubmitting}
            className="min-w-[120px] font-medium"
          >
            {isSubmitting
              ? isEditing
                ? 'Saving...'
                : 'Creating...'
              : isEditing
              ? 'Save Changes'
              : 'Create Facility'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

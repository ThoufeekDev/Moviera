import { memo } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input, Textarea } from '@/shared/ui';
import type { FormValues } from '../../../schemas/createTheatreForm.schema';

export interface BasicInfoSectionProps {
  disabled?: boolean;
}

export const BasicInfoSection = memo(function BasicInfoSection({ disabled }: BasicInfoSectionProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();

  return (
    <div className="rounded-lg border border-border bg-surface-muted/30 p-4">
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">
        1. Basic Information
      </h4>
      <div className="space-y-4">
        <Input
          id="theatre-name"
          label="Theatre Name *"
          placeholder="e.g. PVR: Forum Mall, Koramangala"
          disabled={disabled}
          error={errors.name}
          {...register('name')}
        />

        <Textarea
          id="theatre-description"
          label="Description / Amenities Overview"
          placeholder="Brief summary of screen experiences, Dolby Atmos support, parking, accessibility, etc."
          rows={2}
          disabled={disabled}
          error={errors.description?.message}
          {...register('description')}
        />
      </div>
    </div>
  );
});

export default BasicInfoSection;

import { memo } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/shared/ui';
import type { FormValues } from '../../../schemas/createTheatreForm.schema';

export interface ContactLicenseSectionProps {
  disabled?: boolean;
}

export const ContactLicenseSection = memo(function ContactLicenseSection({ disabled }: ContactLicenseSectionProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();

  return (
    <div className="rounded-lg border border-border bg-surface-muted/30 p-4">
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">
        3. Contact & Licence
      </h4>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input
          id="theatre-email"
          type="email"
          label="Contact Email"
          placeholder="e.g. help@pvrtheatres.com"
          disabled={disabled}
          error={errors.email}
          {...register('email')}
        />

        <Input
          id="theatre-phone"
          type="tel"
          label="Contact Phone"
          placeholder="e.g. +919876543210"
          disabled={disabled}
          error={errors.phone}
          {...register('phone')}
        />

        <Input
          id="theatre-license"
          label="Licence Number"
          placeholder="e.g. LIC-KA-2024-897"
          disabled={disabled}
          error={errors.licenseNumber}
          helperText="Unique regulatory theatre license"
          {...register('licenseNumber')}
        />
      </div>
    </div>
  );
});

export default ContactLicenseSection;

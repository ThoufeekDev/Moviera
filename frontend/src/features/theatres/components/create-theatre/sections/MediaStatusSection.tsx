import { Controller, useFormContext } from 'react-hook-form';
import { ImageUpload } from '@/shared/ui';
import type { FormValues } from '../../../schemas/createTheatreForm.schema';

export interface MediaStatusSectionProps {
  logoError?: string | null;
  onLogoSelect: (file: File) => void;
  onLogoRemove: () => void;
  disabled?: boolean;
}

export function MediaStatusSection({
  logoError,
  onLogoSelect,
  onLogoRemove,
  disabled,
}: MediaStatusSectionProps) {
  const { control } = useFormContext<FormValues>();

  return (
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
            onImageSelect={onLogoSelect}
            onImageRemove={onLogoRemove}
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
                  disabled={disabled}
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
  );
}

export default MediaStatusSection;

import { memo, useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { AlertCircle, Check } from 'lucide-react';
import { Skeleton, Button } from '@/shared/ui';
import { cn } from '@/shared/lib/cn';
import { useActiveFacilities } from '../../../hooks/useActiveFacilities';
import { FacilityIcon } from '../../../icons/facilityIcons';
import type { FormValues } from '../../../schemas/createTheatreForm.schema';

export interface FacilitiesSectionProps {
  disabled?: boolean;
}

export const FacilitiesSection = memo(function FacilitiesSection({
  disabled,
}: FacilitiesSectionProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormValues>();

  const {
    data: facilities = [],
    isLoading,
    isError,
    refetch,
  } = useActiveFacilities();

  const handleToggle = useCallback(
    (facilityId: string, currentIds: string[], onChange: (ids: string[]) => void) => {
      if (disabled) return;
      const isSelected = currentIds.includes(facilityId);
      const next = isSelected
        ? currentIds.filter((id) => id !== facilityId)
        : [...currentIds, facilityId];
      onChange(next);
    },
    [disabled],
  );

  return (
    <div className="rounded-lg border border-border bg-surface-muted/30 p-4">
      <Controller
        name="facilityIds"
        control={control}
        render={({ field }) => {
          const selectedIds = Array.isArray(field.value) ? field.value : [];

          return (
            <>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    4. Facilities & Amenities
                  </h4>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    Select all amenities available at this theatre.
                  </p>
                </div>
                {selectedIds.length > 0 && (
                  <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-600 border border-brand-200">
                    {selectedIds.length} selected
                  </span>
                )}
              </div>

              {isLoading && (
                <div
                  className="grid grid-cols-2 gap-2.5 sm:grid-cols-3"
                  role="status"
                  aria-label="Loading facilities"
                >
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="h-11 rounded-lg" />
                  ))}
                </div>
              )}

              {isError && (
                <div
                  role="alert"
                  className="flex items-center justify-between gap-3 rounded-lg border border-danger-200 bg-danger-50/70 p-3 text-xs text-danger-700"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-danger-600" />
                    <span>Failed to load active facilities.</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => refetch()}
                    disabled={disabled}
                    className="h-7 px-2.5 text-xs cursor-pointer"
                  >
                    Retry
                  </Button>
                </div>
              )}

              {!isLoading && !isError && facilities.length === 0 && (
                <div className="rounded-lg border border-dashed border-border bg-surface p-4 text-center">
                  <p className="text-xs text-ink-muted">
                    No active facilities are currently available.
                  </p>
                </div>
              )}

              {!isLoading && !isError && facilities.length > 0 && (
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {facilities.map((facility) => {
                    const isSelected = selectedIds.includes(facility.id);

                    return (
                      <button
                        key={facility.id}
                        id={`theatre-facility-${facility.id}`}
                        type="button"
                        role="checkbox"
                        aria-checked={isSelected}
                        disabled={disabled}
                        onClick={() =>
                          handleToggle(facility.id, selectedIds, field.onChange)
                        }
                        className={cn(
                          'group flex min-h-[44px] items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-xs transition-all duration-150',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1',
                          isSelected
                            ? 'border-brand-600 bg-brand-50/80 text-brand-700 font-medium shadow-2xs'
                            : 'border-border bg-surface text-ink hover:border-brand-500/40 hover:bg-surface-muted/40',
                          disabled
                            ? 'opacity-60 cursor-not-allowed'
                            : 'cursor-pointer',
                        )}
                      >
                        <div
                          className={cn(
                            'flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition-colors',
                            isSelected
                              ? 'border-brand-500/30 bg-brand-100 text-brand-700'
                              : 'border-border bg-surface-muted text-ink-muted group-hover:text-ink',
                          )}
                        >
                          <FacilityIcon iconKey={facility.iconKey} size={15} />
                        </div>
                        <span className="truncate flex-1" title={facility.name}>
                          {facility.name}
                        </span>
                        {isSelected && (
                          <Check
                            className="h-4 w-4 shrink-0 text-brand-600 stroke-[2.5]"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {errors.facilityIds && (
                <p className="mt-2 text-xs font-medium text-danger-600">
                  {errors.facilityIds.message}
                </p>
              )}
            </>
          );
        }}
      />
    </div>
  );
});

export default FacilitiesSection;

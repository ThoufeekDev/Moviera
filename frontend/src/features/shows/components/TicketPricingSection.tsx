import type { SeatType } from '@/features/theatres';
import { cn } from '@/shared/lib/cn';
import { Info, Tag } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import type { CreateShowFormValues } from '../schemas/createShowForm.schema';
import type { ComputedSeatCategoryPrice } from '../utils/showPricing.utils';

export interface TicketPricingSectionProps {
  categoryPrices: ComputedSeatCategoryPrice[];
  /** Pricing cannot change once the show has booking activity. */
  locked?: boolean;
}

const SEAT_CATEGORY_DOT_CLASSES: Record<SeatType, string> = {
  REGULAR: 'bg-info-600/70',
  PREMIUM: 'bg-brand-500',
  RECLINER: 'bg-warning-500',
  SOFA: 'bg-info-600',
  WHEELCHAIR: 'bg-success-500',
};

export default function TicketPricingSection({
  categoryPrices,
  locked = false,
}: TicketPricingSectionProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateShowFormValues>();

  return (
    <section
      aria-labelledby="ticket-pricing-heading"
      className="rounded-lg border border-border bg-surface p-5 shadow-card sm:p-6"
    >
      {/* Card Header */}
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-600">
          <Tag className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h2 id="ticket-pricing-heading" className="text-base font-bold text-ink">
            Ticket Pricing
          </h2>
          <p className="text-xs text-ink/60">
            Set the base price and category-wise adjustments
          </p>
        </div>
      </div>

      {/* Base Ticket Price + Info Callout */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 md:items-start">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="base-ticket-price-input"
            className="text-xs font-semibold text-ink"
          >
            Base Ticket Price <span className="text-danger-600">*</span>
          </label>
          <div className="relative flex items-center">
            <span className="pointer-events-none absolute left-3.5 text-sm font-semibold text-ink/60">
              ₹
            </span>
            <input
              id="base-ticket-price-input"
              type="number"
              min={1}
              step="1"
              {...register('basePriceRupees', { valueAsNumber: true })}
              readOnly={locked}
              className={cn(
                'min-h-[44px] w-full rounded-md border bg-surface pl-8 pr-3.5 py-2 text-sm font-semibold text-ink focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20',
                locked && 'cursor-not-allowed bg-surface-muted/60',
                errors.basePriceRupees ? 'border-danger-600' : 'border-border',
              )}
            />
          </div>
          {errors.basePriceRupees && (
            <p className="text-xs text-danger-600">
              {errors.basePriceRupees.message}
            </p>
          )}
        </div>

        <div className="flex items-start gap-2.5 rounded-md border border-border bg-surface-muted/70 px-3.5 py-3 text-xs text-ink/80 md:mt-5">
          <Info
            className="mt-0.5 h-4 w-4 shrink-0 text-ink/60"
            aria-hidden="true"
          />
          <p>
            This is the base price for{' '}
            <span className="font-semibold text-ink">Regular</span> seats.{' '}
            <span className="font-semibold text-ink">Category adjustments</span>{' '}
            will be added to this price.
          </p>
        </div>
      </div>

      {/* Seat Category Adjustments Table */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-bold text-ink">Seat Category Adjustments</h3>

        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted/60 text-xs font-semibold text-ink/70">
                <th className="px-4 py-2.5">Seat Category</th>
                <th className="px-4 py-2.5 text-center">Adjustment (₹)</th>
                <th className="px-4 py-2.5 text-right">Final Price (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {categoryPrices.map((row) => {
                const fieldError =
                  errors.priceAdjustmentsRupees?.[row.seatType]?.message;

                return (
                  <tr key={row.seatType} className="hover:bg-surface-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          aria-hidden="true"
                          className={cn(
                            'h-2.5 w-2.5 rounded-full',
                            SEAT_CATEGORY_DOT_CLASSES[row.seatType],
                          )}
                        />
                        <label
                          htmlFor={`seat-adjustment-${row.seatType}`}
                          className="text-xs font-semibold text-ink"
                        >
                          {row.label}
                        </label>
                      </div>
                      {fieldError && (
                        <p className="mt-1 text-[11px] text-danger-600">
                          {fieldError}
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-2.5 text-center">
                      <input
                        id={`seat-adjustment-${row.seatType}`}
                        type="number"
                        step="1"
                        {...register(`priceAdjustmentsRupees.${row.seatType}`, {
                          valueAsNumber: true,
                        })}
                        readOnly={locked}
                        className={cn(
                          'mx-auto block h-9 w-24 rounded border bg-surface px-2.5 py-1 text-xs font-medium text-ink focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20',
                          locked && 'cursor-not-allowed bg-surface-muted/60',
                          !row.isValid || fieldError
                            ? 'border-danger-600'
                            : 'border-border',
                        )}
                      />
                    </td>

                    <td className="px-4 py-2.5 text-right">
                      <span
                        className={cn(
                          'inline-flex min-w-[48px] items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-bold',
                          row.isValid
                            ? 'bg-brand-50 text-brand-600'
                            : 'bg-danger-600/10 text-danger-600',
                        )}
                      >
                        {row.finalPriceRupees}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}


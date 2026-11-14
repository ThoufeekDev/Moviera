import type { Movie, MovieTheatreFormat } from '@/features/movies';
import type { ScreenListItem, Theatre } from '@/features/theatres';
import { Button } from '@/shared/ui/Button';
import type { ShowSubmitMode } from '../hooks/useCreateShowForm';
import {
  Building2,
  Calendar,
  Clock,
  Film,
  Info,
  Monitor,
  Sparkles,
} from 'lucide-react';
import { formatRupeesValue } from '../utils/showPricing.utils';
import {
  formatShowDisplayDate,
  formatShowTime12h,
} from '../utils/showScheduling.utils';

export interface ShowSummaryCardProps {
  selectedTheatre: Theatre | undefined;
  selectedMovie: Movie | undefined;
  selectedScreen: ScreenListItem | undefined;
  selectedFormat: MovieTheatreFormat | undefined;
  showDate: string;
  startTimeDate: Date | null;
  endTimeDate: Date | null;
  basePriceRupees: number;
  priceRange: { minRupees: number; maxRupees: number };
  hasScheduleConflict: boolean;
  isSubmitting: boolean;
  submittingMode: ShowSubmitMode | null;
  isEditMode?: boolean;
  onSaveAsDraft: () => void;
  onCreateAndPublish: () => void;
  onSaveChanges?: () => void;
}

export default function ShowSummaryCard({
  selectedTheatre,
  selectedMovie,
  selectedScreen,
  selectedFormat,
  showDate,
  startTimeDate,
  endTimeDate,
  basePriceRupees,
  priceRange,
  hasScheduleConflict,
  isSubmitting,
  submittingMode,
  isEditMode = false,
  onSaveAsDraft,
  onCreateAndPublish,
  onSaveChanges,
}: ShowSummaryCardProps) {
  const movieLanguages =
    selectedMovie?.languages?.map((l) => l.name).join(', ') || 'Multi-language';
  const movieGenres =
    selectedMovie?.genres && selectedMovie.genres.length > 0
      ? selectedMovie.genres.map((g) => g.name).join(', ')
      : selectedMovie?.primaryGenre?.name || 'Feature';

  const totalSeats = selectedScreen?.totalSeats ?? 0;

  return (
    <aside
      aria-labelledby="show-summary-heading"
      className="sticky top-6 rounded-lg border border-border bg-surface p-5 shadow-card sm:p-6"
    >
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <Calendar className="h-4 w-4 text-ink/70" aria-hidden="true" />
        <h2 id="show-summary-heading" className="text-base font-bold text-ink">
          Show Summary
        </h2>
      </div>

      {/* Movie Preview Block */}
      <div className="mb-5 flex items-start gap-3.5 border-b border-border pb-5">
        {selectedMovie?.posterUrl ? (
          <img
            src={selectedMovie.posterUrl}
            alt={selectedMovie.title}
            className="h-24 w-16 shrink-0 rounded-md object-cover bg-surface-muted shadow-sm"
          />
        ) : (
          <div className="flex h-24 w-16 shrink-0 items-center justify-center rounded-md bg-surface-muted text-ink/40">
            <Film className="h-6 w-6" aria-hidden="true" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-ink">
            {selectedMovie?.title ?? 'No movie selected'}
          </p>
          <p className="mt-0.5 text-xs text-ink/60">
            {selectedMovie ? `${movieLanguages} · ${movieGenres}` : 'Select a movie'}
          </p>
          {selectedMovie && (
            <div className="mt-2 inline-flex items-center gap-1 text-xs text-ink/70">
              <Clock className="h-3.5 w-3.5 text-ink/50" aria-hidden="true" />
              <span>{selectedMovie.duration} min</span>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Metadata */}
      <dl className="mb-5 space-y-3 border-b border-border pb-5 text-xs">
        <div className="flex items-center justify-between gap-3">
          <dt className="flex items-center gap-2 text-ink/60">
            <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Theatre</span>
          </dt>
          <dd className="truncate font-semibold text-ink">
            {selectedTheatre?.name ?? '—'}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-3">
          <dt className="flex items-center gap-2 text-ink/60">
            <Monitor className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Screen</span>
          </dt>
          <dd className="truncate font-semibold text-ink">
            {selectedScreen?.name ?? '—'}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-3">
          <dt className="flex items-center gap-2 text-ink/60">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Format</span>
          </dt>
          <dd className="font-semibold text-ink">
            {selectedFormat?.name ?? '—'}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-3">
          <dt className="flex items-center gap-2 text-ink/60">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Date</span>
          </dt>
          <dd className="font-semibold text-ink">
            {formatShowDisplayDate(showDate)}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-3">
          <dt className="flex items-center gap-2 text-ink/60">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Show Time</span>
          </dt>
          <dd className="font-semibold text-ink">
            {startTimeDate
              ? `${formatShowTime12h(startTimeDate)} – ${formatShowTime12h(endTimeDate)}`
              : '—'}
          </dd>
        </div>
      </dl>

      {/* Pricing Summary */}
      <div className="mb-4 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-ink/70">Base Price</span>
          <span className="font-bold text-ink">
            {formatRupeesValue(basePriceRupees)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="font-bold text-ink">Price Range</span>
          <span className="font-bold text-brand-600">
            {formatRupeesValue(priceRange.minRupees)} –{' '}
            {formatRupeesValue(priceRange.maxRupees)}
          </span>
        </div>
      </div>

      {/* Seat Inventory Info Banner */}
      <div className="mb-5 flex items-start gap-2.5 rounded-md border border-border bg-surface-muted/70 px-3.5 py-3 text-xs text-ink/80">
        <Info
          className="mt-0.5 h-4 w-4 shrink-0 text-ink/60"
          aria-hidden="true"
        />
        <p>
          {isEditMode ? (
            <>
              Seat prices are only regenerated when pricing changes and the show has no
              bookings.
            </>
          ) : (
            <>
              A total of{' '}
              <span className="font-semibold text-ink">{totalSeats} show seats</span>{' '}
              will be created with the above pricing.
            </>
          )}
        </p>
      </div>

      {/* Action Buttons */}
      {isEditMode ? (
        <Button
          type="button"
          variant="primary"
          size="md"
          disabled={isSubmitting || hasScheduleConflict}
          loading={isSubmitting && submittingMode === 'SAVE'}
          onClick={onSaveChanges}
          className="w-full"
        >
          Save Changes
        </Button>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              disabled={isSubmitting || hasScheduleConflict}
              loading={isSubmitting && submittingMode === 'DRAFT'}
              onClick={onSaveAsDraft}
              className="w-full"
            >
              Save as Draft
            </Button>

            <Button
              type="button"
              variant="primary"
              size="md"
              disabled={isSubmitting || hasScheduleConflict}
              loading={isSubmitting && submittingMode === 'PUBLISH'}
              onClick={onCreateAndPublish}
              className="w-full"
            >
              Create &amp; Publish
            </Button>
          </div>

          <p className="mt-3 text-center text-[11px] text-ink/60">
            You can also save as draft and publish later.
          </p>
        </>
      )}
    </aside>
  );
}

import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import {
  Badge,
  Button,
  EmptyState,
  ErrorState,
  Pagination,
  SearchBar,
  Skeleton,
} from '@/shared/ui';
import {
  Calendar,
  Clapperboard,
  Clock,
  Film,
  Monitor,
  Plus,
  Send,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useCancelShow } from '../hooks/useCancelShow';
import { usePublishShow } from '../hooks/usePublishShow';
import { useShows } from '../hooks/useShows';
import type { ShowStatusFilter } from '../types/show.types';
import { formatRupeesFromPaise } from '../utils/showPricing.utils';
import {
  formatShowDisplayDate,
  formatShowTime12h,
} from '../utils/showScheduling.utils';

export interface ShowListSectionProps {
  theatreId?: string;
  onScheduleShow: () => void;
}

const STATUS_FILTER_OPTIONS: Array<{ label: string; value: ShowStatusFilter }> = [
  { label: 'All Shows', value: 'ALL' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Drafts', value: 'DRAFT' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

export default function ShowListSection({
  theatreId,
  onScheduleShow,
}: ShowListSectionProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ShowStatusFilter>('ALL');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch } = useShows({
    theatreId,
    search: search.trim() || undefined,
    status,
    page,
    limit: 20,
  });

  const publishMutation = usePublishShow();
  const cancelMutation = useCancelShow();

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (nextStatus: ShowStatusFilter) => {
    setStatus(nextStatus);
    setPage(1);
  };

  const handlePublish = async (showId: string) => {
    try {
      await publishMutation.mutateAsync(showId);
      toast.success('Show published successfully!');
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleCancel = async (showId: string) => {
    try {
      await cancelMutation.mutateAsync(showId);
      toast.success('Show cancelled.');
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    }
  };

  const items = data?.items ?? [];
  const pagination = data?.pagination;
  const hasFilters = Boolean(search.trim() || status !== 'ALL');

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-ink">Scheduled Shows</h2>
          <p className="text-xs text-ink/60">
            Manage draft and published movie showtimes
          </p>
        </div>

        <Button variant="primary" size="md" onClick={onScheduleShow}>
          <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" />
          Schedule Show
        </Button>
      </div>

      {/* Search & Status Filter Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-md">
          <SearchBar
            value={search}
            onChange={handleSearchChange}
            onSearch={handleSearchChange}
            placeholder="Search by movie, screen, or format..."
          />
        </div>

        <div
          role="group"
          aria-label="Filter shows by status"
          className="flex flex-wrap items-center gap-1.5"
        >
          {STATUS_FILTER_OPTIONS.map((opt) => {
            const active = status === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleStatusChange(opt.value)}
                className={`min-h-[38px] rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  active
                    ? 'border-brand-600 bg-brand-600 text-surface'
                    : 'border-border bg-surface text-ink/70 hover:bg-surface-muted'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content States */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4">
          <Skeleton className="h-28 w-full rounded-lg" />
          <Skeleton className="h-28 w-full rounded-lg" />
          <Skeleton className="h-28 w-full rounded-lg" />
        </div>
      ) : isError ? (
        <ErrorState
          title="Failed to load shows"
          message={getErrorMessage(error)}
          onRetry={refetch}
        />
      ) : items.length === 0 ? (
        hasFilters ? (
          <EmptyState
            icon={<Clapperboard className="h-8 w-8 text-ink/40" />}
            title="No matching shows found"
            description="No shows match your current search or status filter."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch('');
                  setStatus('ALL');
                  setPage(1);
                }}
              >
                Clear search and filters
              </Button>
            }
          />
        ) : (
          <EmptyState
            icon={<Clapperboard className="h-8 w-8 text-ink/40" />}
            title="No shows scheduled yet"
            description="Schedule your first movie show to generate seat inventory and start accepting bookings."
            action={
              <Button variant="primary" size="sm" onClick={onScheduleShow}>
                <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" />
                Schedule Show
              </Button>
            }
          />
        )
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((show) => {
            const showDateStr = show.startTime.slice(0, 10);
            const isPublishing =
              publishMutation.isPending && publishMutation.variables === show.id;
            const isCancelling =
              cancelMutation.isPending && cancelMutation.variables === show.id;

            return (
              <article
                key={show.id}
                className="flex flex-col justify-between gap-4 rounded-lg border border-border bg-surface p-4 shadow-card sm:flex-row sm:items-center"
              >
                <div className="flex items-start gap-3.5">
                  {show.movie.posterUrl ? (
                    <img
                      src={show.movie.posterUrl}
                      alt={show.movie.title}
                      className="h-20 w-14 shrink-0 rounded object-cover bg-surface-muted"
                    />
                  ) : (
                    <div className="flex h-20 w-14 shrink-0 items-center justify-center rounded bg-surface-muted text-ink/40">
                      <Film className="h-5 w-5" aria-hidden="true" />
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-ink">
                        {show.movie.title}
                      </h3>
                      <Badge
                        variant={
                          show.status === 'PUBLISHED'
                            ? 'success'
                            : show.status === 'DRAFT'
                              ? 'warning'
                              : 'secondary'
                        }
                      >
                        {show.status}
                      </Badge>
                      <span className="rounded border border-border bg-surface-muted px-2 py-0.5 text-[11px] font-semibold text-ink">
                        {show.cinemaFormat.name}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink/70">
                      <span className="inline-flex items-center gap-1">
                        <Monitor className="h-3.5 w-3.5 text-ink/50" />
                        {show.theatre.name} · {show.screen.name}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-ink/50" />
                        {formatShowDisplayDate(showDateStr)}
                      </span>
                      <span className="inline-flex items-center gap-1 font-medium text-ink">
                        <Clock className="h-3.5 w-3.5 text-ink/50" />
                        {formatShowTime12h(show.startTime)} –{' '}
                        {formatShowTime12h(show.endTime)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-ink/60">
                      <span>
                        Base Price:{' '}
                        <strong className="text-ink">
                          {formatRupeesFromPaise(show.basePrice)}
                        </strong>
                      </span>
                      <span>·</span>
                      <span>
                        Seats: {show.seatSummary.availableSeats}/
                        {show.seatSummary.totalSeats} available
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                  {show.status === 'DRAFT' && (
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={isPublishing || isCancelling}
                      loading={isPublishing}
                      onClick={() => handlePublish(show.id)}
                    >
                      <Send className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                      Publish
                    </Button>
                  )}

                  {show.status !== 'CANCELLED' && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isPublishing || isCancelling}
                      loading={isCancelling}
                      onClick={() => handleCancel(show.id)}
                    >
                      <XCircle
                        className="mr-1.5 h-3.5 w-3.5 text-danger-600"
                        aria-hidden="true"
                      />
                      Cancel
                    </Button>
                  )}
                </div>
              </article>
            );
          })}

          {pagination && pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      )}
    </div>
  );
}

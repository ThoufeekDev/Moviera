import type { TheatreOverview as TheatreOverviewData } from '../types/theatreOverview.types';

interface TheatreOverviewProps {
  overview: TheatreOverviewData;
}

const recentActivities = [
  {
    id: 1,
    text: 'Theatre profile was updated',
    time: 'Recently',
  },
  {
    id: 2,
    text: 'Screen configuration was updated',
    time: 'Recently',
  },
  {
    id: 3,
    text: 'Theatre facilities were updated',
    time: 'Recently',
  },
];

export default function TheatreOverview({ overview }: TheatreOverviewProps) {
  const { theatre, statistics, facilities, reviews } = overview;

  return (
    <div className="flex flex-col gap-6">
      {/* Statistics */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-ink">Theatre Overview</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-lg border border-border bg-surface p-5 shadow-card">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-brand-500/20 bg-brand-50 text-brand-600">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
            </div>

            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">Total Screens</span>
              <span className="text-2xl font-bold text-ink">{statistics.totalScreens}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-lg border border-border bg-surface p-5 shadow-card">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-success-500/20 bg-emerald-50 text-success-700">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21a8 8 0 0 1 16 0" />
              </svg>
            </div>

            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">Total Seats</span>
              <span className="text-2xl font-bold text-ink">{statistics.totalSeats}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-lg border border-border bg-surface p-5 shadow-card">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-info-600/20 bg-blue-50 text-info-600">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>

            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">Total Shows</span>
              <span className="text-2xl font-bold text-ink">{statistics.totalShows}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Theatre Information */}
      <section className="rounded-lg border border-border bg-surface p-6 shadow-card">
        <h3 className="mb-4 text-base font-semibold text-ink">Theatre Information</h3>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Address</span>
            <p className="mt-1 text-sm font-medium text-ink">{theatre.address || 'N/A'}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Email</span>
              <p className="mt-1 truncate text-sm font-medium text-ink">{theatre.email || 'N/A'}</p>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Phone</span>
              <p className="mt-1 text-sm font-medium text-ink">{theatre.phone || 'N/A'}</p>
            </div>
          </div>

          <div className="sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Description</span>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">
              {theatre.description || 'No description available'}
            </p>
          </div>
        </div>

        {/* Facilities */}
        <div className="mt-6 border-t border-border pt-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Facilities</span>

          <div className="mt-2.5 flex flex-wrap gap-2">
            {facilities.length > 0 ? (
              facilities.map((facility) => (
                <span
                  key={facility.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-ink"
                >
                  <span aria-hidden="true">{facility.icon ?? '•'}</span>
                  <span>{facility.name}</span>
                </span>
              ))
            ) : (
              <span className="text-xs text-ink-muted">No facilities added</span>
            )}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="rounded-lg border border-border bg-surface p-6 shadow-card">
        <h3 className="mb-4 text-base font-semibold text-ink">Reviews</h3>

        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-md bg-warning-500/10 text-2xl font-bold text-warning-700">
            {reviews.averageRating.toFixed(1)}
          </div>

          <div>
            <div className="text-sm tracking-wider text-warning-500" aria-hidden="true">★★★★★</div>
            <p className="text-xs text-ink-muted">
              {reviews.totalReviews} {reviews.totalReviews === 1 ? 'review' : 'reviews'}
            </p>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="rounded-lg border border-border bg-surface p-6 shadow-card">
        <h3 className="mb-4 text-base font-semibold text-ink">Recent Activity</h3>

        <div className="divide-y divide-border">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-brand-600" aria-hidden="true" />
                <span className="text-sm font-medium text-ink">{activity.text}</span>
              </div>
              <span className="text-xs text-ink-muted">{activity.time}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
import type { TheatreOverview as TheatreOverviewData } from '../../types/theatreOverview';

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
        <h2 className="mb-4 text-lg font-bold text-slate-900">Theatre Overview</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-brand-500/20 bg-brand-500/10 text-brand-500">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
            </div>

            <div>
              <span className="block text-xs font-semibold text-slate-500">Total Screens</span>
              <span className="text-2xl font-extrabold text-slate-900">{statistics.totalScreens}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21a8 8 0 0 1 16 0" />
              </svg>
            </div>

            <div>
              <span className="block text-xs font-semibold text-slate-500">Total Seats</span>
              <span className="text-2xl font-extrabold text-slate-900">{statistics.totalSeats}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-600">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>

            <div>
              <span className="block text-xs font-semibold text-slate-500">Total Shows</span>
              <span className="text-2xl font-extrabold text-slate-900">{statistics.totalShows}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Theatre Information */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-base font-bold text-slate-900">Theatre Information</h3>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Address</span>
            <p className="mt-1 text-sm font-medium text-slate-700">{theatre.address || 'N/A'}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email</span>
              <p className="mt-1 truncate text-sm font-medium text-slate-700">{theatre.email || 'N/A'}</p>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Phone</span>
              <p className="mt-1 text-sm font-medium text-slate-700">{theatre.phone || 'N/A'}</p>
            </div>
          </div>

          <div className="sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Description</span>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              {theatre.description || 'No description available'}
            </p>
          </div>
        </div>

        {/* Facilities */}
        <div className="mt-6 border-t border-slate-100 pt-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Facilities</span>

          <div className="mt-2.5 flex flex-wrap gap-2">
            {facilities.length > 0 ? (
              facilities.map((facility) => (
                <span
                  key={facility.id}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
                >
                  <span>{facility.icon ?? '•'}</span>
                  <span>{facility.name}</span>
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500">No facilities added</span>
            )}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-base font-bold text-slate-900">Reviews</h3>

        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-2xl font-black text-amber-500">
            {reviews.averageRating.toFixed(1)}
          </div>

          <div>
            <div className="text-sm tracking-wider text-amber-400">★★★★★</div>
            <p className="text-xs text-slate-500">
              {reviews.totalReviews} {reviews.totalReviews === 1 ? 'review' : 'reviews'}
            </p>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-base font-bold text-slate-900">Recent Activity</h3>

        <div className="divide-y divide-slate-100">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-brand-500" />
                <span className="text-sm font-medium text-slate-700">{activity.text}</span>
              </div>
              <span className="text-xs text-slate-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';

export default function SuperAdminDashboardPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-ink">
          Super Admin Dashboard
        </h1>
        <p className="text-xs md:text-sm text-ink-muted">
          Master catalog management, movie listings, and platform supervision.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="rounded-lg border border-border bg-surface p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-md bg-brand-50 border border-brand-100 text-brand-600">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                <line x1="7" y1="2" x2="7" y2="22" />
                <line x1="17" y1="2" x2="17" y2="22" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <line x1="2" y1="7" x2="7" y2="7" />
                <line x1="2" y1="17" x2="7" y2="17" />
                <line x1="17" y1="17" x2="22" y2="17" />
                <line x1="17" y1="7" x2="22" y2="7" />
              </svg>
            </div>
            <h3 className="text-base font-medium text-ink">Movie Catalog</h3>
            <p className="mt-1 text-xs md:text-sm text-ink-muted leading-relaxed">
              Browse, search, edit, and toggle active status for movies across the platform.
            </p>
          </div>
          <div className="mt-5">
            <Link to="/super-admin/movies">
              <Button variant="primary" size="sm" fullWidth>
                Manage Movies
              </Button>
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-md bg-surface-muted border border-border text-ink">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <h3 className="text-base font-medium text-ink">Add New Movie</h3>
            <p className="mt-1 text-xs md:text-sm text-ink-muted leading-relaxed">
              Publish a new movie title with media posters, certifications, genres, cast, and crew.
            </p>
          </div>
          <div className="mt-5">
            <Link to="/super-admin/movies/create">
              <Button variant="secondary" size="sm" fullWidth>
                Add Movie
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

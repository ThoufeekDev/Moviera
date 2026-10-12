import { EmptyState } from '@/shared/ui/EmptyState';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Hero search strip */}
      <section className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-6 sm:p-8 shadow-card">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-ink">
            Welcome to Moviera
          </h1>
          <p className="text-sm md:text-base text-ink-muted">
            Book tickets for movies, premier cinema screens, and entertainment.
          </p>
        </div>

        <div className="relative max-w-xl w-full">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search movies, languages, or genres..."
            className="h-11 min-h-[44px] w-full rounded-md border border-border bg-surface pl-10 pr-4 text-base text-ink placeholder:text-ink-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
          />
        </div>
      </section>

      {/* Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-ink">
            Recommended Movies
          </h2>
        </div>

        <EmptyState
          title="Browse Movies & Showtimes"
          description="Movies scheduled by theatre administrators will appear here. Cinema partners can list their shows in the partner portal."
          action={
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/theatre-admin/login">
                <Button variant="secondary" size="md">
                  Cinema Partner Portal
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="md">
                  Explore Account Options
                </Button>
              </Link>
            </div>
          }
        />
      </section>
    </div>
  );
}

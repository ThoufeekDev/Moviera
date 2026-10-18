import { Link } from 'react-router-dom';
import { MovieraLogo } from '@/shared/ui/MovieraLogo';

export default function GatewayPage() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-4 sm:p-6 bg-page text-ink font-sans">
      <div className="w-full max-w-3xl flex flex-col items-center">
        {/* Platform Entry Header */}
        <header className="mb-8 flex flex-col items-center text-center">
          <MovieraLogo size="lg" />
          <h1 className="mt-4 mb-2 text-2xl md:text-3xl font-bold tracking-tight text-ink">
            Choose Your Gateway
          </h1>
          <p className="max-w-md text-sm md:text-base text-ink-muted leading-relaxed">
            Join Moviera to book tickets for the latest movies or partner with us to manage your theatre listings.
          </p>
        </header>

        {/* Grid Configuration Segment */}
        <nav className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2" aria-label="Portal Navigation Actions">
          {/* OPTION 1: MOVIE GOER / USER */}
          <Link
            to="/register/user"
            className="group flex flex-col justify-between rounded-lg border border-border bg-surface p-6 sm:p-8 transition-all duration-150 hover:shadow-card hover:border-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
          >
            <div>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md border border-brand-100 bg-brand-50 text-brand-600">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                  <path d="M6 12h.01M18 12h.01" />
                  <polygon points="10,9 15,12 10,15" fill="currentColor" />
                </svg>
              </div>

              <h2 className="mb-1 text-base font-medium text-ink group-hover:text-brand-600 transition-colors">
                Movie Goer
              </h2>
              <p className="text-xs md:text-sm text-ink-muted leading-relaxed">
                Book tickets, reserve seats, explore upcoming releases, and enjoy movies.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-1.5 text-sm font-medium text-brand-600">
              <span>Get Started</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </Link>

          {/* OPTION 2: THEATER PARTNER / ADMIN */}
          <Link
            to="/theatre-admin/register"
            className="group flex flex-col justify-between rounded-lg border border-border bg-surface p-6 sm:p-8 transition-all duration-150 hover:shadow-card hover:border-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
          >
            <div>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md border border-border bg-surface-muted text-ink">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 21h18M5 21V7l7-4 7 4v14" />
                  <path d="M9 10h2M13 10h2M9 14h2M13 14h2" />
                </svg>
              </div>

              <h2 className="mb-1 text-base font-medium text-ink group-hover:text-brand-600 transition-colors">
                Theatre Partner
              </h2>
              <p className="text-xs md:text-sm text-ink-muted leading-relaxed">
                List your theater, manage showtimes, screen layouts, and ticket reservations.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-1.5 text-sm font-medium text-brand-600">
              <span>Partner With Us</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </Link>
        </nav>

        <footer className="mt-8 text-xs md:text-sm text-ink-muted">
          Already have an account?{' '}
          <Link to="/user/login" className="font-medium text-brand-600 hover:underline">
            Login Here
          </Link>
        </footer>
      </div>
    </div>
  );
}

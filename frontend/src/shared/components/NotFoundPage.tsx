import { Link } from 'react-router-dom';
import { MovieraLogo } from '@/shared/ui/MovieraLogo';
import { Button } from '@/shared/ui/Button';

export default function NotFoundPage() {
  return (
    <main className="relative flex min-h-dvh w-full flex-col items-center justify-center bg-page p-4 font-sans text-ink">
      <div className="flex w-full max-w-md flex-col items-center rounded-lg border border-border bg-surface p-6 sm:p-8 text-center shadow-card">
        {/* Brand Logo */}
        <div className="mb-4">
          <MovieraLogo size="md" />
        </div>

        {/* Error Display Code */}
        <h1 className="my-2 text-6xl sm:text-7xl font-black tracking-tight text-brand-600">
          404
        </h1>

        {/* Message */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
            Scene Not Found
          </h2>
          <p className="mt-2 text-xs md:text-sm leading-relaxed text-ink-muted">
            Oops! It looks like this movie scene took a wrong turn or the showtime URL was removed. Let&apos;s get you back to the main stage.
          </p>
        </div>

        {/* Actions */}
        <div className="flex w-full flex-col sm:flex-row gap-3">
          <Link to="/" className="flex-1">
            <Button variant="primary" fullWidth size="md">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>Return to Home</span>
            </Button>
          </Link>

          <Button
            type="button"
            variant="secondary"
            size="md"
            className="flex-1"
            onClick={() => window.history.back()}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Go Back</span>
          </Button>
        </div>
      </div>

      <footer className="mt-6 text-xs text-ink-muted">
        <p>&copy; {new Date().getFullYear()} Moviera. All rights reserved.</p>
      </footer>
    </main>
  );
}

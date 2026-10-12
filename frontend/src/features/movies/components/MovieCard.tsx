import { Link } from 'react-router-dom';
import type { Movie } from '../types/movie.types';

interface MovieCardProps {
  movie: Movie;
  onToggleStatus?: (movieId: string, currentStatus: boolean) => void;
}

export default function MovieCard({ movie, onToggleStatus }: MovieCardProps) {
  const formattedReleaseDate = movie.releaseDate
    ? new Date(movie.releaseDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'N/A';

  const hours = Math.floor(movie.duration / 60);
  const mins = movie.duration % 60;
  const durationText = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-card transition-all duration-200 hover:border-brand-600/40 hover:shadow-float sm:flex-row">
      {/* Left: Poster */}
      <div className="relative aspect-[2/3] w-full shrink-0 overflow-hidden bg-nav sm:h-auto sm:w-44">
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={`${movie.title} poster`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center text-nav-ink/60">
            <svg
              className="h-10 w-10 text-nav-ink/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
            <span className="mt-2 text-xs font-medium">No Poster</span>
          </div>
        )}

        <div className="absolute top-3 left-3 z-10">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm ${
              movie.isActive
                ? 'border border-success-500/30 bg-surface/90 text-success-700'
                : 'border border-danger-600/30 bg-surface/90 text-danger-600'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                movie.isActive ? 'bg-success-500' : 'bg-danger-600'
              }`}
              aria-hidden="true"
            />
            {movie.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Right: Rich Details & Actions */}
      <div className="flex flex-1 min-w-0 flex-col justify-between p-4 sm:p-5">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="truncate text-base font-bold text-ink group-hover:text-brand-600 transition-colors" title={movie.title}>
              {movie.title}
            </h3>
            {movie.certification && (
              <span className="shrink-0 rounded-sm border border-border bg-surface-muted px-2 py-0.5 text-xs font-bold text-ink">
                {movie.certification}
              </span>
            )}
          </div>

          {/* Genres, Duration & Formats */}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            {movie.primaryGenre && (
              <span className="rounded-full bg-brand-50 border border-brand-100 px-2.5 py-0.5 font-medium text-brand-600">
                {movie.primaryGenre.name}
              </span>
            )}

            <span className="inline-flex items-center gap-1 text-ink-muted">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                <circle cx="12" cy="12" r="9" strokeWidth="2" />
                <path strokeWidth="2" strokeLinecap="round" d="M12 7v5l3 2" />
              </svg>
              {durationText}
            </span>

            {movie.cinemaFormats && movie.cinemaFormats.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {movie.cinemaFormats.map((fmt) => (
                  <span key={fmt.id} className="rounded-full border border-border bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-ink-muted">
                    {fmt.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Languages */}
          {movie.languages && movie.languages.length > 0 && (
            <p className="mt-2 text-xs text-ink-muted">
              <span className="font-semibold text-ink">Languages:</span>{' '}
              {movie.languages.map((lang) => lang.name).join(', ')}
            </p>
          )}

          {/* Short Synopsis / Description preview */}
          {movie.description && (
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink-muted">
              {movie.description}
            </p>
          )}
        </div>

        {/* Footer info & Action buttons */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-border pt-3 text-xs">
          <div className="inline-flex items-center gap-1.5 text-ink-muted">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" />
              <path strokeWidth="2" d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            <span>
              Release: <strong className="text-ink">{formattedReleaseDate}</strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/super-admin/movies/${movie.id}`}
              className="inline-flex min-h-[44px] items-center gap-1 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-ink shadow-card transition-colors hover:border-brand-600 hover:bg-brand-50 hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
            >
              <span>View Details</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              to={`/super-admin/movies/${movie.id}/edit`}
              className="inline-flex min-h-[44px] items-center gap-1 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-ink shadow-card transition-colors hover:border-border hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
              title="Edit Movie"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edit</span>
            </Link>

            {onToggleStatus && (
              <button
                type="button"
                onClick={() => onToggleStatus(movie.id, movie.isActive)}
                className={`inline-flex min-h-[44px] items-center rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 ${
                  movie.isActive
                    ? 'border border-danger-600/30 bg-danger-600/10 text-danger-600 hover:bg-danger-600/20'
                    : 'border border-success-500/30 bg-emerald-50 text-success-700 hover:bg-emerald-100'
                }`}
              >
                {movie.isActive ? 'Deactivate' : 'Activate'}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
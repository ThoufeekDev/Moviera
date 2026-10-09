import { Link } from 'react-router-dom';
import type { Movie } from '../../types/movie.types';

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
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-brand-500/30 hover:shadow-md sm:flex-row">
      {/* Left: Poster */}
      <div className="relative h-60 sm:h-auto sm:w-44 shrink-0 overflow-hidden bg-slate-900">
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={`${movie.title} poster`}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            fetchPriority="high"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center text-slate-500">
            <svg
              className="h-10 w-10 text-slate-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur-md ${
              movie.isActive
                ? 'border border-emerald-500/30 bg-emerald-950/70 text-emerald-300'
                : 'border border-rose-500/30 bg-rose-950/70 text-rose-300'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                movie.isActive ? 'bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.7)]' : 'bg-rose-400'
              }`}
            />
            {movie.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Right: Rich Details & Actions */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="truncate text-lg font-bold text-slate-900 group-hover:text-brand-500 transition-colors" title={movie.title}>
              {movie.title}
            </h3>
            {movie.certification && (
              <span className="shrink-0 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-bold text-slate-700">
                {movie.certification}
              </span>
            )}
          </div>

          {/* Genres, Duration & Formats */}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            {movie.primaryGenre && (
              <span className="rounded-full bg-brand-50 px-2.5 py-0.5 font-semibold text-brand-600 border border-brand-200/60">
                {movie.primaryGenre.name}
              </span>
            )}

            <span className="inline-flex items-center gap-1 text-slate-500">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-3.5 w-3.5">
                <circle cx="12" cy="12" r="9" strokeWidth="2" />
                <path strokeWidth="2" strokeLinecap="round" d="M12 7v5l3 2" />
              </svg>
              {durationText}
            </span>

            {movie.cinemaFormats && movie.cinemaFormats.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {movie.cinemaFormats.map((fmt) => (
                  <span key={fmt.id} className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600">
                    {fmt.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Languages */}
          {movie.languages && movie.languages.length > 0 && (
            <p className="mt-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Languages:</span>{' '}
              {movie.languages.map((lang) => lang.name).join(', ')}
            </p>
          )}

          {/* Short Synopsis / Description preview */}
          {movie.description && (
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600">
              {movie.description}
            </p>
          )}
        </div>

        {/* Footer info & Action buttons */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs">
          <div className="inline-flex items-center gap-1.5 text-slate-500">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-3.5 w-3.5">
              <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" />
              <path strokeWidth="2" d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            <span>
              Release: <strong className="text-slate-700">{formattedReleaseDate}</strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/super-admin/movies/${movie.slug}`}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 shadow-sm transition hover:border-brand-500 hover:bg-brand-50 hover:text-brand-600"
            >
              <span>View Details</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-3 w-3">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              to={`/super-admin/movies/${movie.id}/edit`}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
              title="Edit Movie"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-3.5 w-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edit</span>
            </Link>

            {onToggleStatus && (
              <button
                type="button"
                onClick={() => onToggleStatus(movie.id, movie.isActive)}
                className={`rounded-lg px-3 py-1.5 font-semibold transition ${
                  movie.isActive
                    ? 'border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                    : 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
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
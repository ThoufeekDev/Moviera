import { useParams, Link, useNavigate } from 'react-router-dom';
import MovieDetailSkeleton from '../components/MovieDetailSkeleton';
import { useToggleMovieStatus } from '../hooks/useToggleMovieStatus';
import { useMovieBySlug } from '../hooks/useMovieBySlug';

export default function MovieDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: movie, isLoading, isError, refetch } = useMovieBySlug(slug);
  const { mutate: toggleMovieStatus, isPending: isTogglingStatus } = useToggleMovieStatus();

  if (isLoading) {
    return <MovieDetailSkeleton />;
  }

  if (isError || !movie) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-6 bg-page font-sans">
        <div className="flex w-full max-w-md flex-col items-center rounded-lg border border-border bg-surface p-8 text-center shadow-card">
          <svg className="mb-4 h-12 w-12 text-danger-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path strokeWidth="2" strokeLinecap="round" d="M12 8v4m0 4h.01" />
          </svg>
          <h2 className="text-xl font-bold text-ink">Movie Not Found</h2>
          <p className="mt-2 text-sm text-ink-muted">
            The requested movie details could not be loaded or may not exist.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex min-h-[44px] items-center rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-card transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
            >
              Retry
            </button>
            <Link
              to="/super-admin/movies"
              className="inline-flex min-h-[44px] items-center rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-ink shadow-card transition-colors hover:border-brand-600 hover:bg-brand-50 hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
            >
              Back to Movies
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formattedReleaseDate = movie.releaseDate
    ? new Date(movie.releaseDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'N/A';

  const hours = Math.floor(movie.duration / 60);
  const mins = movie.duration % 60;
  const durationText = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  const handleToggleActiveStatus = async () => {
    toggleMovieStatus({
      movieId: movie.id,
      isActive: !movie.isActive,
    });
  };

  const getEmbedUrl = (url?: string | null) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : null;
  };

  const embedTrailerUrl = getEmbedUrl(movie.trailerUrl);

  return (
    <div className="min-h-screen bg-page pb-20 sm:pb-12 font-sans text-ink">
      {/* Top Header Navigation */}
      <nav className="sticky top-0 z-20 flex items-center justify-between border-b border-border/20 bg-nav px-4 sm:px-6 lg:px-8 py-3 text-nav-ink shadow-card backdrop-blur-md">
        <button
          type="button"
          onClick={() => navigate('/super-admin/movies')}
          className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-nav-ink/80 transition-colors hover:text-nav-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 rounded-md px-2"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Movies
        </button>
        <span className="truncate text-xs sm:text-sm text-nav-ink/70">
          Movies / <strong className="text-nav-ink font-semibold">{movie.title}</strong>
        </span>
      </nav>

      {/* Hero Banner Section (BookMyShow Dark Hero) */}
      <header className="relative min-h-[440px] overflow-hidden bg-nav py-8 sm:py-12 px-4 sm:px-6 lg:px-8 text-nav-ink">
        {/* Backdrop background overlay */}
        <div className="absolute inset-0 h-full w-full">
          {movie.backdropUrl || movie.posterUrl ? (
            <img
              src={movie.backdropUrl || movie.posterUrl!}
              alt={`${movie.title} backdrop`}
              className="h-full w-full object-cover blur-sm brightness-[0.35] scale-105"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-nav via-slate-900 to-black" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-nav via-nav/90 to-nav/60" />
        </div>

        {/* Hero Content Grid */}
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start">
          {/* Left Column: Poster */}
          <div className="w-48 sm:w-56 shrink-0 aspect-[2/3] overflow-hidden rounded-lg border border-white/10 bg-nav shadow-float relative">
            {movie.posterUrl ? (
              <img
                src={movie.posterUrl}
                alt={`${movie.title} poster`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-nav-ink/60 font-medium">
                <span>No Poster</span>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 border-t border-white/10 bg-nav/90 p-2 text-xs font-semibold backdrop-blur-md">
              <span
                className={`h-2 w-2 rounded-full ${
                  movie.isActive ? 'bg-success-500' : 'bg-danger-600'
                }`}
                aria-hidden="true"
              />
              <span className={movie.isActive ? 'text-emerald-300' : 'text-rose-300'}>
                {movie.isActive ? 'In Cinemas / Active' : 'Inactive'}
              </span>
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="flex flex-1 min-w-0 flex-col gap-4 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              {movie.certification && (
                <span className="rounded-sm border border-white/20 bg-white/10 px-2 py-0.5 text-xs font-bold text-white">
                  {movie.certification}
                </span>
              )}
              {movie.primaryGenre && (
                <span className="rounded-full bg-brand-500/20 border border-brand-500/40 px-3 py-0.5 text-xs font-medium text-rose-200">
                  {movie.primaryGenre.name}
                </span>
              )}
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/90">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" strokeWidth="2" />
                  <path strokeWidth="2" strokeLinecap="round" d="M12 7v5l3 2" />
                </svg>
                {durationText}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">{movie.title}</h1>

            {/* Languages & Formats Chips */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs">
              {movie.cinemaFormats && movie.cinemaFormats.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-semibold text-white/70">Formats:</span>
                  {movie.cinemaFormats.map((fmt) => (
                    <span key={fmt.id} className="rounded-full bg-white/10 border border-white/10 px-2.5 py-0.5 text-white/90">
                      {fmt.name}
                    </span>
                  ))}
                </div>
              )}

              {movie.languages && movie.languages.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-semibold text-white/70">Languages:</span>
                  {movie.languages.map((lang) => (
                    <span key={lang.id} className="rounded-full bg-white/10 border border-white/10 px-2.5 py-0.5 text-white/90">
                      {lang.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <p className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-white/80">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" />
                <path strokeWidth="2" d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              Releasing on <strong className="text-white">{formattedReleaseDate}</strong>
            </p>

            {/* Desktop Action Toolbar */}
            <div className="mt-4 hidden sm:flex flex-wrap gap-3">
              {movie.trailerUrl && (
                <a
                  href={movie.trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-card transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch Trailer
                </a>
              )}

              <Link
                to={`/super-admin/movies/${movie.id}/edit`}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Movie
              </Link>

              <button
                type="button"
                onClick={handleToggleActiveStatus}
                disabled={isTogglingStatus}
                className={`inline-flex min-h-[44px] items-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 ${
                  movie.isActive
                    ? 'border border-danger-600/40 bg-danger-600/20 text-rose-200 hover:bg-danger-600/30'
                    : 'border border-success-500/40 bg-success-500/20 text-emerald-200 hover:bg-success-500/30'
                }`}
              >
                {isTogglingStatus ? 'Updating...' : movie.isActive ? 'Deactivate Movie' : 'Activate Movie'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Section 1: About the Movie */}
        <section className="rounded-lg border border-border bg-surface p-6 shadow-card">
          <h2 className="mb-4 text-xl font-bold text-ink">About the Movie</h2>
          <p className="text-sm leading-relaxed text-ink-muted">
            {movie.description || 'No synopsis available for this movie yet.'}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-md border border-border bg-surface-muted p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Certification</span>
              <p className="mt-1 text-sm font-bold text-ink">{movie.certification || 'Not Rated'}</p>
            </div>
            <div className="rounded-md border border-border bg-surface-muted p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Primary Genre</span>
              <p className="mt-1 text-sm font-bold text-ink">{movie.primaryGenre?.name || 'N/A'}</p>
            </div>
            <div className="rounded-md border border-border bg-surface-muted p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Genres</span>
              <p className="mt-1 text-sm font-bold text-ink">
                {movie.genres?.length ? movie.genres.map((g) => g.name).join(', ') : 'N/A'}
              </p>
            </div>
            <div className="rounded-md border border-border bg-surface-muted p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Duration</span>
              <p className="mt-1 text-sm font-bold text-ink">{durationText}</p>
            </div>
          </div>
        </section>

        {/* Section 2: Cast & Crew */}
        {(movie.cast && movie.cast.length > 0) || (movie.crew && movie.crew.length > 0) ? (
          <section className="rounded-lg border border-border bg-surface p-6 shadow-card">
            <h2 className="mb-6 text-xl font-bold text-ink">Cast &amp; Crew</h2>

            {movie.cast && movie.cast.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-ink-muted">Cast</h3>
                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2 lg:grid lg:grid-cols-6 lg:overflow-visible">
                  {movie.cast.map((item) => (
                    <div key={item.id} className="flex min-w-[96px] flex-col items-center text-center snap-start">
                      <div className="h-16 w-16 overflow-hidden rounded-full border border-border bg-surface-muted shrink-0">
                        {item.profileImageUrl ? (
                          <img src={item.profileImageUrl} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center font-bold text-ink-muted text-sm">
                            {item.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <span className="mt-2 text-xs font-semibold text-ink truncate w-full">{item.name}</span>
                      {item.character && <span className="text-[11px] text-ink-muted truncate w-full">as {item.character}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {movie.crew && movie.crew.length > 0 && (
              <div>
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-ink-muted">Crew</h3>
                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2 lg:grid lg:grid-cols-6 lg:overflow-visible">
                  {movie.crew.map((item) => (
                    <div key={item.id} className="flex min-w-[96px] flex-col items-center text-center snap-start">
                      <div className="h-16 w-16 overflow-hidden rounded-full border border-border bg-surface-muted shrink-0">
                        {item.profileImageUrl ? (
                          <img src={item.profileImageUrl} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center font-bold text-ink-muted text-sm">
                            {item.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <span className="mt-2 text-xs font-semibold text-ink truncate w-full">{item.name}</span>
                      <span className="text-[11px] text-ink-muted truncate w-full">{item.job}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        ) : null}

        {/* Section 3: Trailer Media Embed */}
        {embedTrailerUrl && (
          <section className="rounded-lg border border-border bg-surface p-6 shadow-card">
            <h2 className="mb-4 text-xl font-bold text-ink">Official Trailer</h2>
            <div className="aspect-video w-full overflow-hidden rounded-md border border-border bg-surface-muted">
              <iframe
                src={embedTrailerUrl}
                title={`${movie.title} Official Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </section>
        )}
      </main>

      {/* Mobile Sticky Bottom Action Bar with Safe-Area Padding */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-border bg-surface/95 p-3 backdrop-blur-md pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden shadow-float">
        {movie.trailerUrl && (
          <a
            href={movie.trailerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-md bg-brand-600 px-3 py-2 text-sm font-semibold text-white shadow-card transition-colors hover:bg-brand-700"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
            Trailer
          </a>
        )}

        <Link
          to={`/super-admin/movies/${movie.id}/edit`}
          className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-ink shadow-card transition-colors hover:bg-surface-muted"
        >
          Edit
        </Link>

        <button
          type="button"
          onClick={handleToggleActiveStatus}
          disabled={isTogglingStatus}
          className={`inline-flex min-h-[44px] flex-1 items-center justify-center rounded-md px-3 py-2 text-xs font-semibold transition-colors ${
            movie.isActive
              ? 'border border-danger-600/30 bg-danger-600/10 text-danger-600'
              : 'border border-success-500/30 bg-emerald-50 text-success-700'
          }`}
        >
          {isTogglingStatus ? '...' : movie.isActive ? 'Deactivate' : 'Activate'}
        </button>
      </div>
    </div>
  );
}

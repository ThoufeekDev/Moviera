import { useParams, Link, useNavigate } from 'react-router-dom';
import MovieDetailSkeleton from '../components/skeletons/MovieDetailSkeleton';
import { useToggleMovieStatus } from '../hooks/useToggleMovieStatus';

import { useMovieBySlug } from '../hooks/useMovieBySlug';

export default function MovieDetailsPage() {
  const { slug } = useParams<{ slug: string }>();

  console.log('slug is ',slug);
  
  const navigate = useNavigate();
  const { data: movie, isLoading, isError, refetch } = useMovieBySlug(slug);
  const { mutate: toggleMovieStatus, isPending: isTogglingStatus } = useToggleMovieStatus();

  if (isLoading) {
    return <MovieDetailSkeleton />;
  }

  if (isError || !movie) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-6 bg-slate-950 font-sans">
        <div className="flex w-full max-w-md flex-col items-center rounded-2xl border border-rose-500/30 bg-slate-900 p-8 text-center shadow-xl">
          <svg className="mb-4 h-12 w-12 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path strokeWidth="2" strokeLinecap="round" d="M12 8v4m0 4h.01" />
          </svg>
          <h2 className="text-xl font-bold text-white">Movie Not Found</h2>
          <p className="mt-2 text-sm text-slate-400">
            The requested movie details could not be loaded or may not exist.
          </p>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600 shadow-md shadow-brand-500/25"
            >
              Retry
            </button>
            <Link
              to="/super-admin/movies"
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
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
    <div className="min-h-screen bg-slate-950 pb-12 font-sans text-white">
      {/* Top Header Navigation */}
      <nav className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-800 bg-slate-950/90 px-6 py-4 backdrop-blur-md">
        <button
          type="button"
          onClick={() => navigate('/super-admin/movies')}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 transition hover:text-brand-500"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Movies
        </button>
        <span className="text-sm text-slate-500">
          Movies / <strong className="text-white">{movie.title}</strong>
        </span>
      </nav>

      {/* Hero Banner Section */}
      <header className="relative min-h-[460px] overflow-hidden bg-slate-900 py-10 px-6">
        {/* Backdrop background overlay */}
        <div className="absolute inset-0 h-full w-full">
          {movie.backdropUrl || movie.posterUrl ? (
            <img
              src={movie.backdropUrl || movie.posterUrl!}
              alt={`${movie.title} backdrop`}
              className="h-full w-full object-cover blur-sm brightness-[0.4] scale-105"
              fetchPriority="high"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-slate-800 to-slate-950" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/60" />
        </div>

        {/* Hero Content Grid */}
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col sm:flex-row gap-8 items-start">
          {/* Left Column: Poster */}
          <div className="w-56 shrink-0 aspect-[2/3] overflow-hidden rounded-2xl border border-white/15 bg-slate-900 shadow-2xl relative">
            {movie.posterUrl ? (
              <img
                src={movie.posterUrl}
                alt={`${movie.title} poster`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-500 font-medium">
                <span>No Poster</span>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 border-t border-white/10 bg-slate-950/85 p-2 text-xs font-semibold backdrop-blur-md">
              <span
                className={`h-2 w-2 rounded-full ${
                  movie.isActive ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-rose-400'
                }`}
              />
              {movie.isActive ? 'In Cinemas / Active' : 'Inactive'}
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="flex flex-1 flex-col gap-4 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              {movie.certification && (
                <span className="rounded-md border border-white/20 bg-white/10 px-2 py-0.5 text-xs font-bold text-white">
                  {movie.certification}
                </span>
              )}
              {movie.primaryGenre && (
                <span className="rounded-full bg-brand-500/20 border border-brand-500/40 px-3 py-0.5 text-xs font-semibold text-rose-300">
                  {movie.primaryGenre.name}
                </span>
              )}
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-slate-300">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-3.5 w-3.5">
                  <circle cx="12" cy="12" r="9" strokeWidth="2" />
                  <path strokeWidth="2" strokeLinecap="round" d="M12 7v5l3 2" />
                </svg>
                {durationText}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">{movie.title}</h1>

            {/* Languages & Formats Chips */}
            <div className="flex flex-wrap gap-4 text-xs">
              {movie.cinemaFormats && movie.cinemaFormats.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-400">Formats:</span>
                  {movie.cinemaFormats.map((fmt) => (
                    <span key={fmt.id} className="rounded-md bg-slate-800 border border-slate-700 px-2 py-0.5 text-slate-200">
                      {fmt.name}
                    </span>
                  ))}
                </div>
              )}

              {movie.languages && movie.languages.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-400">Languages:</span>
                  {movie.languages.map((lang) => (
                    <span key={lang.id} className="rounded-md bg-slate-800 border border-slate-700 px-2 py-0.5 text-slate-200">
                      {lang.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <p className="flex items-center gap-1.5 text-xs text-slate-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-3.5 w-3.5">
                <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" />
                <path strokeWidth="2" d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              Releasing on <strong className="text-white">{formattedReleaseDate}</strong>
            </p>

            {/* Quick Action Toolbar */}
            <div className="mt-4 flex flex-wrap gap-3">
              {movie.trailerUrl && (
                <a
                  href={movie.trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-600"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch Trailer
                </a>
              )}

              <Link
                to={`/super-admin/movies/${movie.id}/edit`}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Movie
              </Link>

              <button
                type="button"
                onClick={handleToggleActiveStatus}
                disabled={isTogglingStatus}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  movie.isActive
                    ? 'border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20'
                    : 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                }`}
              >
                {isTogglingStatus ? 'Updating...' : movie.isActive ? 'Deactivate Movie' : 'Activate Movie'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8">
        {/* Section 1: About the Movie */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-white">About the Movie</h2>
          <p className="text-sm leading-relaxed text-slate-300">
            {movie.description || 'No synopsis available for this movie yet.'}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <span className="text-xs font-semibold text-slate-400">Certification</span>
              <p className="mt-1 text-sm font-bold text-white">{movie.certification || 'Not Rated'}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <span className="text-xs font-semibold text-slate-400">Primary Genre</span>
              <p className="mt-1 text-sm font-bold text-white">{movie.primaryGenre?.name || 'N/A'}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <span className="text-xs font-semibold text-slate-400">Genres</span>
              <p className="mt-1 text-sm font-bold text-white">
                {movie.genres?.length ? movie.genres.map((g) => g.name).join(', ') : 'N/A'}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <span className="text-xs font-semibold text-slate-400">Duration</span>
              <p className="mt-1 text-sm font-bold text-white">{durationText}</p>
            </div>
          </div>
        </section>

        {/* Section 2: Cast & Crew */}
        {(movie.cast && movie.cast.length > 0) || (movie.crew && movie.crew.length > 0) ? (
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-bold text-white">Cast &amp; Crew</h2>

            {movie.cast && movie.cast.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">Cast</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  {movie.cast.map((item) => (
                    <div key={item.id} className="flex flex-col items-center text-center">
                      <div className="h-16 w-16 overflow-hidden rounded-full border border-slate-700 bg-slate-800">
                        {item.profileImageUrl ? (
                          <img src={item.profileImageUrl} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center font-bold text-slate-400">
                            {item.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <span className="mt-2 text-xs font-bold text-white">{item.name}</span>
                      {item.character && <span className="text-[11px] text-slate-400">as {item.character}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {movie.crew && movie.crew.length > 0 && (
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">Crew</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  {movie.crew.map((item) => (
                    <div key={item.id} className="flex flex-col items-center text-center">
                      <div className="h-16 w-16 overflow-hidden rounded-full border border-slate-700 bg-slate-800">
                        {item.profileImageUrl ? (
                          <img src={item.profileImageUrl} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center font-bold text-slate-400">
                            {item.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <span className="mt-2 text-xs font-bold text-white">{item.name}</span>
                      <span className="text-[11px] text-slate-400">{item.job}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        ) : null}

        {/* Section 3: Trailer Media Embed */}
        {embedTrailerUrl && (
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-white">Official Trailer</h2>
            <div className="aspect-video w-full overflow-hidden rounded-xl border border-slate-800">
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
    </div>
  );
}

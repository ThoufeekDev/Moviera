import { useState } from 'react';
import MovieCard from './movie-details/components/MovieCard';
import MovieCardSkeleton from './components/skeletons/MovieCardSkeleton';
import { Pagination } from '@/shared/ui/Pagination';
import { ErrorState } from '@/shared/ui/ErrorState';
import { useToggleMovieStatus } from './hooks/useToggleMovieStatus';
import { useMovies } from './hooks/useMovies';
import { useDebounce } from '@/shared/hooks/useDebounce';

export default function MovieManagementPage() {
  const { mutate: toggleMovieStatus } = useToggleMovieStatus();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const limit = 8;
  const debouncedSearch = useDebounce(search, 700);

  const handleToggleStatus = (movieId: string, currentStatus: boolean) => {
    toggleMovieStatus({
      movieId,
      isActive: !currentStatus,
    });
  };

  const { data, isLoading, isFetching, isError, error, refetch } = useMovies({
    page,
    limit,
    search: debouncedSearch || undefined,
  });

  const movies = data?.items ?? [];
  const pagination = data?.pagination;

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-8">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Movies
          </h1>
          <p className="text-sm text-slate-500">Manage all movies in Moviera.</p>
        </header>

        <section className="flex flex-wrap items-center gap-3">
          <div className="relative flex min-w-[240px] flex-1 items-center">
            <svg
              className="pointer-events-none absolute left-3.5 h-4 w-4 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              placeholder="Search movies..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <select className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-500" disabled>
            <option value="">All Genres</option>
          </select>
          <select className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-500" disabled>
            <option value="">All Status</option>
          </select>
        </section>

        {isFetching && (
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-brand-500/20 bg-brand-50/60 px-3.5 py-1.5 text-xs font-semibold text-brand-600">
            <span className="h-2 w-2 rounded-full bg-brand-500 animate-ping" />
            <span>Loading Movies...</span>
          </div>
        )}

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <MovieCardSkeleton key={index} />
          ))}
        </section>
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load movies"
        message={
          error instanceof Error
            ? error.message
            : 'Something went wrong while loading movies.'
        }
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Movies
        </h1>
        <p className="text-sm text-slate-500">Manage all movies in Moviera.</p>
      </header>

      <section className="flex flex-wrap items-center gap-3">
        <div className="relative flex min-w-[240px] flex-1 items-center">
          <svg
            className="pointer-events-none absolute left-3.5 h-4 w-4 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <select className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-brand-500 focus:outline-none">
          <option value="">All Genres</option>
        </select>

        <select className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-brand-500 focus:outline-none">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </section>

      {movies.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <h2 className="text-lg font-bold text-slate-800">No movies found</h2>
          <p className="mt-1 text-sm text-slate-500">
            Movies created by the Super Admin will appear here.
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </section>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}

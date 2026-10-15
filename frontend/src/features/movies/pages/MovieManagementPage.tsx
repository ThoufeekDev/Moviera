import { useState } from 'react';
import MovieCard from '../components/MovieCard';
import MovieCardSkeleton from '../components/MovieCardSkeleton';
import { Pagination, SearchBar, StatusFilter, ErrorState, EmptyState } from '@/shared/ui';
import { useToggleMovieStatus } from '../hooks/useToggleMovieStatus';
import { useMovies } from '../hooks/useMovies';
import { useGenres } from '../hooks/useGenres';

export default function MovieManagementPage() {
  const { mutate: toggleMovieStatus } = useToggleMovieStatus();
  const [search, setSearch] = useState('');
  const [genreId, setGenreId] = useState('');
  const [status, setStatus] = useState<'' | 'ACTIVE' | 'INACTIVE'>('');
  const [page, setPage] = useState(1);

  const limit = 6;

  const { data: genresData } = useGenres();

  const handleToggleStatus = (movieId: string, currentStatus: boolean) => {
    toggleMovieStatus({
      movieId,
      isActive: !currentStatus,
    });
  };

  const { data, isLoading, isFetching, isError, error, refetch } = useMovies({
    page,
    limit,
    search: search.trim() || undefined,
    genreId: genreId || undefined,
    status: status || undefined,
  });

  const movies = data?.items ?? [];
  const pagination = data?.pagination;

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
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-ink">
          Movies
        </h1>
        <p className="text-sm text-ink-muted">Manage all movies in Moviera.</p>
      </header>

      <section className="flex flex-wrap items-center gap-3">
        <SearchBar
          placeholder="Search movies..."
          onSearch={(term) => {
            setSearch(term);
            setPage(1);
          }}
          className="min-w-[240px] flex-1"
        />

        <select
          value={genreId}
          onChange={(e) => {
            setGenreId(e.target.value);
            setPage(1);
          }}
          aria-label="Filter movies by genre"
          className="h-11 rounded-lg border border-border bg-surface px-3 text-base md:text-sm font-medium text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 cursor-pointer transition-colors"
        >
          <option value="">All Genres</option>
          {genresData?.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        <StatusFilter<'' | 'ACTIVE' | 'INACTIVE'>
          value={status}
          onChange={(val) => {
            setStatus(val);
            setPage(1);
          }}
          options={[
            { value: '', label: 'All Status' },
            { value: 'ACTIVE', label: 'Active' },
            { value: 'INACTIVE', label: 'Inactive' },
          ]}
          ariaLabel="Filter movies by status"
        />
      </section>

      {isFetching && !isLoading && (
        <div className="inline-flex items-center gap-2 self-start rounded-full border border-brand-500/20 bg-brand-50 px-3.5 py-1.5 text-xs font-semibold text-brand-600">
          <span className="h-2 w-2 rounded-full bg-brand-600 animate-ping" aria-hidden="true" />
          <span>Refreshing Movies...</span>
        </div>
      )}

      {isLoading ? (
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <MovieCardSkeleton key={index} />
          ))}
        </section>
      ) : movies.length === 0 ? (
        <EmptyState
          title="No movies found"
          description="Movies created by the Super Admin will appear here."
        />
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

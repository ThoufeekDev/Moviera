

import MovieCard from './movie-details/components/MovieCard';
import MovieCardSkeleton from './components/skeletons/MovieCardSkeleton';

import ErrorState from '../../../../shared/components/ErrorState/ErrorState';
import { useToggleMovieStatus } from './hooks/useToggleMovieStatus';


import { useMovies } from './hooks/useMovies';
import {  useState } from 'react';
import { useDebounce } from '../../../../shared/hooks/useDebounce';

import styles from "./MovieManagementPage.module.css"



export default function MovieManagementPage() {
  const { mutate: toggleMovieStatus } = useToggleMovieStatus();
  const [search, setSearch] = useState('');


// Debounce function to limit the rate of function calls
  const debouncedSearch = useDebounce(search,700);

 
 
  const handleToggleStatus = (
  movieId: string,
  currentStatus: boolean
) => {
  toggleMovieStatus({
    movieId,
    isActive: !currentStatus,
  });
  };
  
   const {
    data,
     isLoading,
    isFetching,
    isError,
     error,
    refetch
   } = useMovies({ search: debouncedSearch || undefined });
  
  const movies = data?.movies ?? [];

  
  
  // if (isLoading) return <ContentLoader text="Movies" subtext="Loading movie collection..." />;

  if (isLoading) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <h1>Movies</h1>
            <p>Manage all movies in Moviera.</p>
          </div>
        </header>

        <section className={styles.toolbar}>
          <input
            type="search"
            placeholder="Search movies..."
            className={styles.searchInput}
            value={search ?? ''}
            onChange={(e)=>setSearch(e.target.value)}
            
          />

            {isFetching && (
    <span className={styles.searchLoading}>
      Searching...
    </span>
  )}
          <select className={styles.filter} disabled>
            <option value="">All Genres</option>
          </select>
          <select className={styles.filter} disabled>
            <option value="">All Status</option>
          </select>
        </section>

        <section className={styles.movieList}>
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
          : "Something went wrong while loading movies."
      }
      onRetry={refetch}
    />
  );
}
  return (
     <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>Movies</h1>
          <p>Manage all movies in Moviera.</p>
        </div>
        
      </header>



      <section className={styles.toolbar}>
        <input
          type="search"
          placeholder="Search movies..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className={styles.searchInput}
        />

        <select className={styles.filter}>
          <option value="">All Genres</option>
        </select>

        <select className={styles.filter}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </section>

      {movies.length === 0 ? (
        <div className={styles.emptyState}>
          <h2>No movies found</h2>
          <p>
            Movies created by the Super Admin will appear here.
          </p>
        </div>
      ) : (
        <section className={styles.movieList}>
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </section>
      )}
    </div>
  );
}

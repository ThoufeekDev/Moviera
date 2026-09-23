

import MovieCard from './movie-details/components/MovieCard';
import MovieCardSkeleton from './components/skeletons/MovieCardSkeleton';
import Pagination from '../../../../shared/components/Pagination';
import ErrorState from '../../../../shared/components/ErrorState/ErrorState';
import { useToggleMovieStatus } from './hooks/useToggleMovieStatus';


import { useMovies } from './hooks/useMovies';
import {  useState,useEffect } from 'react';
import { useDebounce } from '../../../../shared/hooks/useDebounce';

import styles from "./MovieManagementPage.module.css"




export default function MovieManagementPage() {
  const { mutate: toggleMovieStatus } = useToggleMovieStatus();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);


   
  const limit = 8;
// Debounce function to limit the rate of function calls
  const debouncedSearch = useDebounce(search, 700);
  
  useEffect(() => {
  setPage(1);
}, [debouncedSearch]);


 
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
   } = useMovies({ page, limit, search: debouncedSearch || undefined });
  

  
  const movies = data?.movies ?? [];
  console.log("movies length is",movies.length);
  
  const pagination = data?.pagination;

  
  
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
          <div className={styles.searchContainer}>
            <svg 
              className={styles.searchIcon} 
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
              className={styles.searchInput}
              value={search ?? ''}
              onChange={(e)=>setSearch(e.target.value)}
            />
          </div>
          <select className={styles.filter} disabled>
            <option value="">All Genres</option>
           
          </select>
          <select className={styles.filter} disabled>
            <option value="">All Status</option>
          </select>
        </section>

        {isFetching && (
          <div className={styles.searchLoadingStatus} aria-live="polite">
            <svg className={styles.spinnerIcon} viewBox="0 0 24 24" fill="none">
              <circle className={styles.spinnerTrack} cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" />
              <path className={styles.spinnerHead} d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span>Loading Movies...</span>
          </div>
        )}

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
        <div className={styles.searchContainer}>
          <svg 
            className={styles.searchIcon} 
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
            onChange={(e)=>setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

 <select className={styles.filter}>
  <option value="">All Genres</option>
</select>

        <select className={styles.filter}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </section>

      {/* {isFetching && (
        <div className={styles.searchLoadingStatus} aria-live="polite">
          <svg className={styles.spinnerIcon} viewBox="0 0 24 24" fill="none">
            <circle className={styles.spinnerTrack} cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" />
            <path className={styles.spinnerHead} d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <span>Searching...</span>
        </div>
      )} */}

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

      {pagination && pagination.totalPages > 1 && (
          <Pagination
    currentPage={pagination.page}
    totalPages={pagination.totalPages}
    onPageChange={setPage}
  />
      )}
    </div>
  );
}

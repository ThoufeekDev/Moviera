// Public module interface for the Movies Bounded Context

export { buildMoviesModule } from './movies.module';

// Read models & Query types
export type { MovieAdminListItem } from './application/read-models/MovieAdminListItem';
export type { MovieAdminDetail } from './application/read-models/MovieAdminDetail';
export type { MovieSchedulingDetails } from './application/read-models/MovieSchedulingDetails';
export type { IMovieSchedulingReader } from './application/ports/IMovieSchedulingReader';

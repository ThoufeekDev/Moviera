// Public module interface for the Movies Bounded Context

export { buildMoviesModule } from './movies.module';

// Domain entities & value objects
export { Movie } from './domain/entities/Movie';
export { Person } from './domain/entities/Person';
export { Genre } from './domain/entities/Genre';
export { Language } from './domain/entities/Language';
export { CinemaFormat } from './domain/entities/CinemaFormat';
export { CastMember } from './domain/value-objects/CastMember';
export { CrewMember } from './domain/value-objects/CrewMember';
export { ImageRef } from './domain/value-objects/ImageRef';
export { Certification } from './domain/enums/Certification';

// Read models & Query types
export type { MovieAdminListItem } from './application/read-models/MovieAdminListItem';
export type { MovieAdminDetail } from './application/read-models/MovieAdminDetail';
export type { IMovieQueryService } from './application/ports/IMovieQueryService';
export type { IMovieRepository } from './domain/repositories/IMovieRepository';

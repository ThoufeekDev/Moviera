import type { MovieSchedulingDetails } from '../read-models/MovieSchedulingDetails';

export interface IMovieSchedulingReader {
  findSchedulingDetailsById(
    id: string,
  ): Promise<MovieSchedulingDetails | null>;
}
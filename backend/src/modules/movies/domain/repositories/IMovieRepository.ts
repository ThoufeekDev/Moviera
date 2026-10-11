import { Movie } from "../entities/Movie";
import { CreateMovieData } from "../types/CreateMovieData";
import { UpdateMovieData } from "../types/UpdateMovieData";

export interface IMovieRepository {
  create(movie: CreateMovieData): Promise<void>;

  findById(id: string): Promise<Movie | null>;

  findBySlug(slug: string): Promise<Movie | null>;

  existsBySlug(slug: string, excludeId?: string): Promise<boolean>;

  updateMovie(id: string, movie: UpdateMovieData): Promise<void>;
}
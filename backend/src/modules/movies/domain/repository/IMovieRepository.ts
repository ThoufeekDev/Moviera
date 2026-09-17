import { Movie } from "../entities/Movie";
import { CreateMovieData } from "../types/CreateMovieData";
import { UpdateMovieData } from "../types/UpdateMovieData";

export interface IMovieRepository {
  // ! CreateMovieData represents data required to create one.
  create(movie: CreateMovieData): Promise<Movie | null>;

  findById(id: string): Promise<Movie | null>;

  findBySlug(slug: string): Promise<Movie | null>;

  findAll(): Promise<Movie[]>;


  updateMovie(id: string, movie: UpdateMovieData): Promise<Movie>;
}
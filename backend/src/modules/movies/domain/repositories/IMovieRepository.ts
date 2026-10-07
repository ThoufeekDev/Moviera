
// import { ListMoviesForAdminQuery } from "../../application/queries/ListMoviesForAdminQuery";
// ;
// import { PaginatedResult } from "../../../../shared/types/Pagination";
import { Movie } from "../entities/Movie";
import { CreateMovieData } from "../types/CreateMovieData";
import { UpdateMovieData } from "../types/UpdateMovieData";

export interface IMovieRepository {
  // ! CreateMovieData represents data required to create one.
  create(movie: CreateMovieData): Promise<void>;

  findById(id: string): Promise<Movie | null>;

  findBySlug(slug: string): Promise<Movie | null>;

  // findAll(query:ListMoviesForAdminQuery): Promise<PaginatedResult<Movie>>;


  updateMovie(id: string, movie: UpdateMovieData): Promise<void>;
}
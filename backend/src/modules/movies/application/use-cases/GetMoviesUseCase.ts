import { Movie } from "../../domain/entities/Movie";
import { IMovieRepository } from "../../domain/repositories/IMovieRepository";
import { GetMoviesQuery } from "../dtos/GetMovieQuery";
import { PaginatedMovies } from "../dtos/PaginatedMovies";


export class GetMovieUseCase {
    // contructor dependancy injection
    constructor(private movieRepository: IMovieRepository) { }
    

    async execute(query:GetMoviesQuery): Promise<PaginatedMovies>{
          
        return await this.movieRepository.findAll(query);
  
      }
} 
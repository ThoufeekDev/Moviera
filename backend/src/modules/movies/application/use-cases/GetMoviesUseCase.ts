import { Movie } from "../../domain/entities/Movie";
import { IMovieRepository } from "../../domain/repository/IMovieRepository";


export class GetMovieUseCase {
    // contructor dependancy injection
    constructor(private movieRepository: IMovieRepository) { }
    

    async execute(): Promise<Movie[]>{
          
        return await this.movieRepository.findAll();
   

  
      }
} 
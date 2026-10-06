import { NotFoundError } from "../../../../shared/exceptions/NotFoundError";
import { Movie } from "../../domain/entities/Movie";
import { IMovieRepository } from "../../domain/repositories/IMovieRepository";



export class GetMovieBySlugUseCase {
    constructor(
        private readonly respository:IMovieRepository
    ) { };


    async execute(slug:string ):Promise<Movie> {
         
        if (!slug) {
            throw new NotFoundError('slug not found....');
          
        }

        const movieBySlug = await this.respository.findBySlug(slug);
        if (!movieBySlug) {
             throw new NotFoundError('Movie not found ')
        }
        
       

        return movieBySlug;
    }
}
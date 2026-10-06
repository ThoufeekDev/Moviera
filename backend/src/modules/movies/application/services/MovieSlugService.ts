import { IMovieRepository } from "../../domain/repositories/IMovieRepository";
import { ConflictError } from "../../../../shared/exceptions/ConflictError";
import { generateSlug } from "../../../../shared/utils/generateSlug";

export class MovieSlugService {
    constructor(private readonly movieRepository: IMovieRepository) { }
    

    async generateUniqueSlug(title: string, currentMovieId?: string): Promise<string>{
     
        const slug = generateSlug(title);

        const existingMovie = await this.movieRepository.findBySlug(slug)
    // Generate a new slug only when the title changes

        if (existingMovie && existingMovie.id !== currentMovieId) {
            throw new ConflictError('Movie Already exists');
        }

        return slug
    }
}
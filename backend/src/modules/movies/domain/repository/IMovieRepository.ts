import { Movie } from "../entities/Movie";

export interface IMovieRepository {
    create(movie: Movie): Promise<Movie | null>;

    findById(id: string): Promise<Movie | null>
    
    findBySlug(slug: string): Promise<Movie | null> 
    
    findAll():Promise<Movie[]>
}
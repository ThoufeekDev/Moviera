
import { Genre } from '../entities/Genre';

export interface IGenreRepository {
    findAll(): Promise<Genre[]>;
 

     // ! validating the genre while creating or updating the movie
    findById(id: string): Promise<Genre | null>
    
    // ! useful for reference-data/seed logic and internal lookups
    findBySlug(slug:string):Promise<Genre | null>
}
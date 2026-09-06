import { Movie } from "../domain/entities/Movie";
import { IMovieRepository } from "../domain/repository/IMovieRepository";
import prisma from "../../../config/database";
import { MovieMapper } from "./MovieMapper";

export class PrismaMovieRepository implements IMovieRepository {
    

    async create(movie: Movie): Promise<Movie | null> {
        const createMovie = await prisma.movie.create({
            data: MovieMapper.toPersistence(movie)
        })

        return createMovie?MovieMapper.toDomain(createMovie):null
    }


    async findById(id: string): Promise<Movie | null> {
        const movie = await prisma.movie.findUnique({
            where:{id},
        })

        return movie?MovieMapper.toDomain(movie):null
    }

    async findBySlug(slug: string): Promise<Movie | null> {
        const movie = await prisma.movie.findUnique({
             where:{slug},
        })
        
        return movie?MovieMapper.toDomain(movie):null
    }

    async findAll(): Promise<Movie[]> {
          
        const allMovies = await prisma.movie.findMany({
            where: {
                isActive:true
            }
        })

         /** 
          * ! we map because allmovie is an array mapper toDomain takes only one args...
          */
        return allMovies.map((movie) => MovieMapper.toDomain(movie));
    }

}
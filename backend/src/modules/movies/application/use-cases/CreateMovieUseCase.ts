import { ConflictError } from "../../../../shared/exceptions/ConflictError";
import { Movie } from "../../domain/entities/Movie";
import { IMovieRepository } from "../../domain/repository/IMovieRepository";
import { CreateMovieDTO } from "../dtos/CreateMovieDTO";
import { CreateMovieData } from "../../domain/types/CreateMovieData";
import { IGenreRepository } from "../../domain/repository/IGenreRepository";
import { ICinemaFormatRepository } from "../../domain/repository/ICinemaFormatRepository";
import { ILanguageRepository } from "../../domain/repository/ILanguageRepository";
import { AppError } from "../../../../shared/exceptions/AppError";
import { IStorageService } from "../../../../shared/domain/services/IStorageService";

export class CreateMovieUseCase {
  // I need a movie repository. Give me one.
  constructor(
    private readonly movieRepository: IMovieRepository,
    private readonly genreRepository: IGenreRepository,
    private readonly languageRepository:ILanguageRepository,
    private readonly cinemaFormatRepository: ICinemaFormatRepository,
    private readonly storageService:IStorageService,
    
  
  ) { }

  async execute(data: CreateMovieDTO): Promise<Movie | null> {


        /** 
         * * finding is that movie exist or not
         
         */
    
    // ! 1. Validate genre

    const genre =  await this.genreRepository.findById(data.primaryGenreId);
    if (!genre) throw new AppError("Invalid or Inactive genre", 400);



    const languages = await this.languageRepository.findByIds(data.languages);
    if(languages.length!==data.languages.length)   throw new AppError( "One or more languages are invalid or inactive",400);




    
    const cinemaFormats = await this.cinemaFormatRepository.findByIds(data.cinemaFormatIds)
     if (cinemaFormats.length !== data.cinemaFormatIds.length) throw new AppError("One or more cinema formats are invalid or inactive",400)

    
    
    const slug = data.title.toLowerCase().trim().replace(/\s+/g, '-');
    const existingMovie = await this.movieRepository.findBySlug(slug);

    if (existingMovie) {
      throw new ConflictError('Movie already exists');
    }

    const [poster, backdrop] = await Promise.all([
  data.posterFile
    ? this.storageService.uploadImage(
        data.posterFile.buffer,
        "moviera/movies/posters",
      )
    : null,

  data.backdropFile
    ? this.storageService.uploadImage(
        data.backdropFile.buffer,
        "moviera/movies/backdrops",
      )
    : null,
]);


    // return this.movieRepository.create(movie);

    const movieData: CreateMovieData = {
      title: data.title,
      slug,
      description: data.description ?? null,
      duration: data.duration,
      releaseDate: data.releaseDate,
      primaryGenreId: data.primaryGenreId,
      certification:data.certification,
      posterUrl: poster?.secureUrl ?? null,
      posterPublicId:poster?.publicId ?? null,
      backdropUrl: backdrop?.secureUrl ?? null,
      backdropPublicId:backdrop?.publicId??null,
      trailerUrl: data.trailerUrl ?? null,
      isActive: true,
    
      languageIds: data.languages,
      cinemaFormatIds:data.cinemaFormatIds,
      

      // cast & crew has array of object
      cast: data.cast,

      crew: data.crew,
    };

    return this.movieRepository.create(movieData);
  }
}
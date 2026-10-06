import { PrismaMovieRepository } from './infrastructure/repositories/PrismaMovieRepository';
import { PrismaGenreRepository } from './infrastructure/repositories/PrismaGenreRepository';
import { PrismaLanguageRepository } from './infrastructure/repositories/PrismaLanguageRepository';
import { PrismaCinemaFormatRepository } from './infrastructure/repositories/PrismaCinemaFormatRepository';
import { PrismaPersonRepository } from './infrastructure/repositories/PrismaPersonRepository';

import { CreateMovieUseCase } from './application/use-cases/CreateMovieUseCase';
import { GetMovieByIdUseCase } from './application/use-cases/GetMovieByIdUseCase';
import { CreatePersonUseCase } from './application/use-cases/CreatePersonUseCase';
import { GetPersonByIdUseCase } from './application/use-cases/GetPersonByIdUseCase';
import { GetPersonsUseCase } from './application/use-cases/GetPersonUseCase';
import { GetLanguageUseCase } from './application/use-cases/GetLanguageUseCase';
import { GetCinemaFormatUseCase } from './application/use-cases/GetCinemaFormatUseCase';
import { GetGenresUseCase } from "./application/use-cases/GetGenresUseCase";
import { GetMoviesUseCase } from './application/use-cases/GetMoviesUseCase';
import { GetMovieBySlugUseCase } from './application/use-cases/GetMovieBySlugUseCase';

import { GetGenreController } from "./presentation/controllers/GetGenreController";
import { CreateMovieController } from './presentation/controllers/CreateMovieController';
import { GetMovieByIdController } from './presentation/controllers/GetMovieByIdController';
import { CreatePersonController } from './presentation/controllers/CreatePersonController';
import { GetPersonByIdController } from './presentation/controllers/GetPersonByIdController';
import { GetPersonController } from './presentation/controllers/GetPersonController';
import { GetLanguageController } from './presentation/controllers/GetLanguageController';
import { GetCinemaFormatController } from './presentation/controllers/GetCinemaFormatController';
import { GetMovieController } from './presentation/controllers/GetMovieController';
import { GetMovieBySlugController } from './presentation/controllers/GetMovieBySlugController';

import { UpdateMovieController } from './presentation/controllers/UpdateMovieController';
import { UpdateMovieUseCase } from './application/use-cases/UpdateMovieUseCase';
import { CloudinaryStorageService } from '../../shared/infrastructure/storage/CloudinaryStorageService';


// services
import { MovieReferenceValidator } from './application/services/MovieReferenceValidator';
import { MovieSlugService } from './application/services/MovieSlugService';
import { MovieImageService } from './application/services/MovieImageService';

export function buildMoviesModule() {
  // * Repositories

  const movieRepository = new PrismaMovieRepository();
  const genreRepository = new PrismaGenreRepository();
  const languageRepository = new PrismaLanguageRepository();
  const cinemaFormatRepository = new PrismaCinemaFormatRepository();
  const personRepository = new PrismaPersonRepository();



  

  // ^ clodinary

  const storageService = new CloudinaryStorageService()
   

    const movieReferenceValidator = new MovieReferenceValidator(
    genreRepository,
    languageRepository,
    cinemaFormatRepository,
    personRepository,
  );

const movieSlugService =
  new MovieSlugService(movieRepository);

const movieImageService =
  new MovieImageService(storageService);


  // * Controllers

  const createMovieController = new CreateMovieController(
    new CreateMovieUseCase(
      movieRepository,
      movieReferenceValidator,
      movieImageService,
      movieSlugService,
      
    )
    
  );

  const getMovieController = new GetMovieController(new GetMoviesUseCase(movieRepository));

  const getMovieByIdController = new GetMovieByIdController(
    new GetMovieByIdUseCase(movieRepository),
  );

  const createPersonController = new CreatePersonController(
    new CreatePersonUseCase(personRepository,storageService)
  );

  const getPersonByIdController = new GetPersonByIdController(
    new GetPersonByIdUseCase(personRepository),
  );

  const getPersonController = new GetPersonController(new GetPersonsUseCase(personRepository));

  const getLanguageController = new GetLanguageController(
    new GetLanguageUseCase(languageRepository),
  );

  const getCinemaFormatController = new GetCinemaFormatController(
    new GetCinemaFormatUseCase(cinemaFormatRepository),
  );



    
    const updateMovieController = new UpdateMovieController(
        new UpdateMovieUseCase(
          movieRepository,
          movieReferenceValidator,
          movieSlugService,
          movieImageService,
        )
    )
    
    const getGenreController = new GetGenreController(
  new GetGenresUseCase(genreRepository)
    );
  
  const getMovieBySlugController = new GetMovieBySlugController(new GetMovieBySlugUseCase(movieRepository))

  return {
    createMovieController,
    getMovieController,
    getMovieByIdController,
    createPersonController,
    getPersonByIdController,
    getPersonController,
    getLanguageController,
    getCinemaFormatController,
    getGenreController,
    updateMovieController,
    getMovieBySlugController,

  };
}

import { PrismaMovieRepository } from './infrastructure/Repo/PrismaMovieRepo';
import { PrismaGenreRepository } from './infrastructure/Repo/PrismaGenreRepo';
import { PrismaLanguageRepository } from './infrastructure/Repo/PrismaLanguageRepo';
import { PrismaCinemaFormatRepository } from './infrastructure/Repo/PrismaCinemaFormatRepo';
import { PrismaPersonRepository } from './infrastructure/Repo/PrismaPersonRepo';

import { CreateMovieUseCase } from './application/use-cases/CreateMovieUseCase';
import { GetMovieByIdUseCase } from './application/use-cases/GetMovieByIdUseCase';
import { CreatePersonUseCase } from './application/use-cases/CreatePersonUseCase';
import { GetPersonByIdUseCase } from './application/use-cases/GetPersonByIdUseCase';
import { GetPersonsUseCase } from './application/use-cases/GetPersonUseCase';
import { GetLanugageUseCase } from './application/use-cases/GetLanugageUseCase';
import { GetCinemaFormatUseCase } from './application/use-cases/GetCinemaFormatUseCase';
import { GetGenresUseCase } from "./application/use-cases/GetGenresUseCase";
import { GetMovieUseCase } from './application/use-cases/GetMoviesUseCase';
import { GetMovieBySlugUseCase } from './application/use-cases/GetMovieBySlugController';

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

export function buildMoviesModule() {
  // * Repositories

  const movieRepository = new PrismaMovieRepository();
  const genreRepository = new PrismaGenreRepository();
  const languageRepository = new PrismaLanguageRepository();
  const cinemaFormatRepository = new PrismaCinemaFormatRepository();
  const personRepository = new PrismaPersonRepository();

  // ^ clodinary

  const storageService = new CloudinaryStorageService()
   

  // * Controllers

  const createMovieController = new CreateMovieController(
    new CreateMovieUseCase(
      movieRepository,
      genreRepository,
      languageRepository,
      cinemaFormatRepository,
      storageService,
    )
    
  );

  const getMovieController = new GetMovieController(new GetMovieUseCase(movieRepository));

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
    new GetLanugageUseCase(languageRepository),
  );

  const getCinemaFormatController = new GetCinemaFormatController(
    new GetCinemaFormatUseCase(cinemaFormatRepository),
  );
    
    const updateMovieController = new UpdateMovieController(
        new UpdateMovieUseCase(
            movieRepository,
            genreRepository,
            languageRepository,
            cinemaFormatRepository,
            personRepository,
            storageService
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
    getMovieBySlugController
  };
}

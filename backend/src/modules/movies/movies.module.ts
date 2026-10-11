import { PrismaClient } from '@prisma/client';

import { PrismaMovieRepository } from './infrastructure/persistence/repositories/PrismaMovieRepository';
import { PrismaGenreRepository } from './infrastructure/persistence/repositories/PrismaGenreRepository';
import { PrismaLanguageRepository } from './infrastructure/persistence/repositories/PrismaLanguageRepository';
import { PrismaCinemaFormatRepository } from './infrastructure/persistence/repositories/PrismaCinemaFormatRepository';
import { PrismaPersonRepository } from './infrastructure/persistence/repositories/PrismaPersonRepository';
import { PrismaMovieQueryService } from './infrastructure/persistence/queries/PrismaMovieQueryService';

import { CreateMovieUseCase } from './application/commands/CreateMovieUseCase';
import { CreatePersonUseCase } from './application/use-cases/CreatePersonUseCase';
import { GetPersonByIdUseCase } from './application/use-cases/GetPersonByIdUseCase';
import { GetPersonsUseCase } from './application/use-cases/GetPersonUseCase';
import { GetLanguageUseCase } from './application/use-cases/GetLanguageUseCase';
import { GetCinemaFormatUseCase } from './application/use-cases/GetCinemaFormatUseCase';
import { GetGenresUseCase } from './application/use-cases/GetGenresUseCase';
import { UpdateMovieUseCase } from './application/use-cases/UpdateMovieUseCase';
import { ListMoviesForAdminUseCase } from './application/queries/ListMoviesForAdminUseCase';
import { GetMovieByIdForAdminUseCase } from './application/queries/GetMovieByIdForAdminUseCase';
import { GetMovieBySlugForAdminUseCase } from './application/queries/GetMovieBySlugForAdminUseCase';

import { GetGenreController } from './presentation/controllers/GetGenreController';
import { CreateMovieController } from './presentation/controllers/CreateMovieController';
import { CreatePersonController } from './presentation/controllers/CreatePersonController';
import { GetPersonByIdController } from './presentation/controllers/GetPersonByIdController';
import { GetPersonController } from './presentation/controllers/GetPersonController';
import { GetLanguageController } from './presentation/controllers/GetLanguageController';
import { GetCinemaFormatController } from './presentation/controllers/GetCinemaFormatController';
import { UpdateMovieController } from './presentation/controllers/UpdateMovieController';
import { ListMoviesForAdminController } from './presentation/controllers/ListMoviesForAdminController';
import { GetMovieByIdForAdminController } from './presentation/controllers/GetMovieByIdForAdminController';
import { GetMovieBySlugForAdminController } from './presentation/controllers/GetMovieBySlugForAdminController';

import { MovieReferenceValidator } from './application/services/MovieReferenceValidator';
import { MovieSlugService } from './application/services/MovieSlugService';
import { MovieImageService } from './application/services/MovieImageService';
import { IStorageService } from '../../shared/application/ports/IStorageService';
import { CloudinaryStorageService } from '../../shared/infrastructure/storage/CloudinaryStorageService';

import { createMovieRoutes } from './presentation/routes/movie.routes';
import { createPersonRoutes } from './presentation/routes/person.routes';
import { createLanguageRoutes } from './presentation/routes/language.routes';
import { createCinemaFormatRoutes } from './presentation/routes/cinema-format.routes';
import { createGenreRoutes } from './presentation/routes/genre.routes';

export function buildMoviesModule(
  prisma: PrismaClient,
  storageService: IStorageService = new CloudinaryStorageService(),
) {
  // Repositories
  const movieRepository = new PrismaMovieRepository(prisma);
  const genreRepository = new PrismaGenreRepository(prisma);
  const languageRepository = new PrismaLanguageRepository(prisma);
  const cinemaFormatRepository = new PrismaCinemaFormatRepository(prisma);
  const personRepository = new PrismaPersonRepository(prisma);
  const movieQueryService = new PrismaMovieQueryService(prisma);

  // Services
  const movieReferenceValidator = new MovieReferenceValidator(
    genreRepository,
    languageRepository,
    cinemaFormatRepository,
    personRepository,
  );
  const movieSlugService = new MovieSlugService(movieRepository);
  const movieImageService = new MovieImageService(storageService);

  // Controllers
  const createMovieController = new CreateMovieController(
    new CreateMovieUseCase(
      movieRepository,
      movieReferenceValidator,
      movieImageService,
      movieSlugService,
    ),
  );

  const listMoviesForAdminController = new ListMoviesForAdminController(
    new ListMoviesForAdminUseCase(movieQueryService),
  );

  const getMovieByIdForAdminController = new GetMovieByIdForAdminController(
    new GetMovieByIdForAdminUseCase(movieQueryService),
  );

  const getMovieBySlugForAdminController = new GetMovieBySlugForAdminController(
    new GetMovieBySlugForAdminUseCase(movieQueryService),
  );

  const createPersonController = new CreatePersonController(
    new CreatePersonUseCase(personRepository, storageService),
  );

  const getPersonByIdController = new GetPersonByIdController(
    new GetPersonByIdUseCase(personRepository),
  );

  const getPersonController = new GetPersonController(
    new GetPersonsUseCase(personRepository),
  );

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
    ),
  );

  const getGenreController = new GetGenreController(
    new GetGenresUseCase(genreRepository),
  );

  const movieRouter = createMovieRoutes({
    listMoviesForAdminController,
    getMovieByIdForAdminController,
    createMovieController,
    getMovieBySlugForAdminController,
    updateMovieController,
  });

  const personRouter = createPersonRoutes({
    createPersonController,
    getPersonController,
    getPersonByIdController,
  });

  const languageRouter = createLanguageRoutes({
    getLanguageController,
  });

  const cinemaFormatRouter = createCinemaFormatRoutes({
    getCinemaFormatController,
  });

  const genreRouter = createGenreRoutes({
    getGenreController,
  });

  return {
    movieRouter,
    personRouter,
    languageRouter,
    cinemaFormatRouter,
    genreRouter,
  };
}

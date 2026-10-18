import { PrismaClient } from '@prisma/client';

import { PrismaMovieRepository } from './infrastructure/persistence/repositories/PrismaMovieRepository';
import { PrismaGenreRepository } from './infrastructure/persistence/repositories/PrismaGenreRepository';
import { PrismaLanguageRepository } from './infrastructure/persistence/repositories/PrismaLanguageRepository';
import { PrismaTheatreFormatRepository } from './infrastructure/persistence/repositories/PrismaTheatreFormatRepository';
import { PrismaPersonRepository } from './infrastructure/persistence/repositories/PrismaPersonRepository';
import { PrismaMovieQueryService } from './infrastructure/persistence/queries/PrismaMovieQueryService';

import { CreateMovieUseCase } from './application/commands/CreateMovieUseCase';
import { CreatePersonUseCase } from './application/commands/CreatePersonUseCase';
import { UpdateMovieUseCase } from './application/commands/UpdateMovieUseCase';

import { GetPersonByIdUseCase } from './application/queries/GetPersonByIdUseCase';
import { ListPersonsUseCase } from './application/queries/ListPersonsUseCase';
import { ListLanguagesUseCase } from './application/queries/ListLanguagesUseCase';
import { ListTheatreFormatsUseCase } from './application/queries/ListTheatreFormatsUseCase';
import { ListGenresUseCase } from './application/queries/ListGenresUseCase';
import { ListMoviesForAdminUseCase } from './application/queries/ListMoviesForAdminUseCase';
import { GetMovieByIdForAdminUseCase } from './application/queries/GetMovieByIdForAdminUseCase';
import { GetMovieBySlugForAdminUseCase } from './application/queries/GetMovieBySlugForAdminUseCase';

import { ListGenresController } from './presentation/controllers/ListGenresController';
import { CreateMovieController } from './presentation/controllers/CreateMovieController';
import { CreatePersonController } from './presentation/controllers/CreatePersonController';
import { GetPersonByIdController } from './presentation/controllers/GetPersonByIdController';
import { ListPersonsController } from './presentation/controllers/ListPersonsController';
import { ListLanguagesController } from './presentation/controllers/ListLanguagesController';
import { ListTheatreFormatsController } from './presentation/controllers/ListTheatreFormatsController';
import { UpdateMovieController } from './presentation/controllers/UpdateMovieController';
import { ListMoviesForAdminController } from './presentation/controllers/ListMoviesForAdminController';
import { GetMovieByIdForAdminController } from './presentation/controllers/GetMovieByIdForAdminController';
import { GetMovieBySlugForAdminController } from './presentation/controllers/GetMovieBySlugForAdminController';

import { MovieReferenceValidator } from './application/services/MovieReferenceValidator';
import { MovieSlugService } from './application/services/MovieSlugService';
import { MovieImageService } from './application/services/MovieImageService';
import { IStorageService } from '../../shared/application/ports/IStorageService';

import { createMovieRoutes } from './presentation/routes/movie.routes';
import { createPersonRoutes } from './presentation/routes/person.routes';
import { createLanguageRoutes } from './presentation/routes/language.routes';
import { createTheatreFormatRoutes } from './presentation/routes/theatre-format.routes';
import { createGenreRoutes } from './presentation/routes/genre.routes';

export function buildMoviesModule(
  prisma: PrismaClient,
  storageService: IStorageService,
) {
  // Repositories
  const movieRepository = new PrismaMovieRepository(prisma);
  const genreRepository = new PrismaGenreRepository(prisma);
  const languageRepository = new PrismaLanguageRepository(prisma);
  const theatreFormatRepository = new PrismaTheatreFormatRepository(prisma);
  const personRepository = new PrismaPersonRepository(prisma);
  const movieQueryService = new PrismaMovieQueryService(prisma);

  // Services
  const movieReferenceValidator = new MovieReferenceValidator(
    genreRepository,
    languageRepository,
    theatreFormatRepository,
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

  const listPersonsController = new ListPersonsController(
    new ListPersonsUseCase(personRepository),
  );

  const listLanguagesController = new ListLanguagesController(
    new ListLanguagesUseCase(languageRepository),
  );

  const listTheatreFormatsController = new ListTheatreFormatsController(
    new ListTheatreFormatsUseCase(theatreFormatRepository),
  );

  const updateMovieController = new UpdateMovieController(
    new UpdateMovieUseCase(
      movieRepository,
      movieReferenceValidator,
      movieSlugService,
      movieImageService,
    ),
  );

  const listGenresController = new ListGenresController(
    new ListGenresUseCase(genreRepository),
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
    listPersonsController,
    getPersonByIdController,
  });

  const languageRouter = createLanguageRoutes({
    listLanguagesController,
  });

  const theatreFormatRouter = createTheatreFormatRoutes({
    listTheatreFormatsController,
  });

  const genreRouter = createGenreRoutes({
    listGenresController,
  });

  return {
    movieRouter,
    personRouter,
    languageRouter,
    theatreFormatRouter,
    genreRouter,
  };
}

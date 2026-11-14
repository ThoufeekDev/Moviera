import type { PrismaClient } from '@prisma/client';
import type { IMovieSchedulingReader } from '../movies';
import type {
  IActiveScreenSeatReader,
  IScreenDetailsReader,
  ITheatreAccessPolicy,
} from '../theatre';
import { CancelShowUseCase } from './application/commands/CancelShowUseCase';
import { CreateShowUseCase } from './application/commands/CreateShowUseCase';
import { PublishShowUseCase } from './application/commands/PublishShowUseCase';
import { UpdateShowUseCase } from './application/commands/UpdateShowUseCase';
import { GetShowDetailsUseCase } from './application/queries/GetShowDetailsUseCase';
import { ListShowsUseCase } from './application/queries/ListShowsUseCase';
import { PrismaShowQueryService } from './infrastructure/persistence/queries/PrismaShowQueryService';
import { PrismaShowRepository } from './infrastructure/persistence/repositories/PrismaShowRepository';
import { CancelShowController } from './presentation/controllers/CancelShowController';
import { CreateShowController } from './presentation/controllers/CreateShowController';
import { GetShowDetailsController } from './presentation/controllers/GetShowDetailsController';
import { ListShowsController } from './presentation/controllers/ListShowsController';
import { PublishShowController } from './presentation/controllers/PublishShowController';
import { UpdateShowController } from './presentation/controllers/UpdateShowController';
import {
  createShowRoutes,
  createTheatreShowRoutes,
} from './presentation/routes/show.routes';

export interface ShowsModuleDependencies {
  theatreAccessPolicy: ITheatreAccessPolicy;
  activeScreenSeatReader: IActiveScreenSeatReader;
  screenDetailsReader: IScreenDetailsReader;
  movieSchedulingReader: IMovieSchedulingReader;
}

export function buildShowsModule(
  prisma: PrismaClient,
  deps: ShowsModuleDependencies,
) {
  // Repositories & Query Services
  const showRepository = new PrismaShowRepository(prisma);
  const showQueryService = new PrismaShowQueryService(prisma);

  // Command Use Cases
  const createShowUseCase = new CreateShowUseCase(
    showRepository,
    deps.screenDetailsReader,
    deps.activeScreenSeatReader,
    deps.movieSchedulingReader,
    deps.theatreAccessPolicy,
  );

  const publishShowUseCase = new PublishShowUseCase(
    showRepository,
    deps.screenDetailsReader,
    deps.movieSchedulingReader,
    deps.theatreAccessPolicy,
  );

  const cancelShowUseCase = new CancelShowUseCase(
    showRepository,
    deps.screenDetailsReader,
    deps.theatreAccessPolicy,
  );

  const updateShowUseCase = new UpdateShowUseCase(
    showRepository,
    deps.screenDetailsReader,
    deps.activeScreenSeatReader,
    deps.movieSchedulingReader,
    deps.theatreAccessPolicy,
  );

  // Query Use Cases
  const listShowsUseCase = new ListShowsUseCase(
    showQueryService,
    deps.theatreAccessPolicy,
    deps.screenDetailsReader,
  );

  const getShowDetailsUseCase = new GetShowDetailsUseCase(
    showQueryService,
    deps.theatreAccessPolicy,
  );

  // Controllers
  const createShowController = new CreateShowController(createShowUseCase);
  const listShowsController = new ListShowsController(listShowsUseCase);
  const getShowDetailsController = new GetShowDetailsController(getShowDetailsUseCase);
  const publishShowController = new PublishShowController(publishShowUseCase);
  const cancelShowController = new CancelShowController(cancelShowUseCase);
  const updateShowController = new UpdateShowController(updateShowUseCase);

  // Routers
  const showRouter = createShowRoutes({
    createShowController,
    listShowsController,
    getShowDetailsController,
    publishShowController,
    cancelShowController,
    updateShowController,
  });

  const theatreShowRouter = createTheatreShowRoutes({
    listShowsController,
  });

  return {
    showRouter,
    theatreShowRouter,
  };
}


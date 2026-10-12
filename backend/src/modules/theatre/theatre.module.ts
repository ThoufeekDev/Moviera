import { PrismaClient } from '@prisma/client';

import { PrismaTheatreRepository } from './infrastructure/persistence/repositories/PrismaTheatreRepository';
import { PrismaScreenRepository } from './infrastructure/persistence/repositories/PrismaScreenRepository';
import { PrismaSeatRepository } from './infrastructure/persistence/repositories/PrismaSeatRepository';
import { PrismaTheatreQueryService } from './infrastructure/persistence/queries/PrismaTheatreQueryService';
import { PrismaTheatreAccessPolicy } from './infrastructure/persistence/repositories/PrismaTheatreAccessPolicy';
import { PrismaTheatreAdminAssignmentRepository } from './infrastructure/persistence/repositories/PrismaTheatreAdminAssignmentRepository';
import { PrismaTheatreAdminUserReader } from './infrastructure/persistence/repositories/PrismaTheatreAdminUserReader';




import { CreateScreenUseCase } from './application/commands/CreateScreenUseCase';
import { CreateSeatUseCase } from './application/commands/CreateSeatUseCase';
import { GetMyTheatresUseCase } from './application/queries/GetMyTheatresUseCase';
import { GetTheatreOverviewUseCase } from './application/queries/GetTheatreOverviewUseCase';
import { AssignTheatreAdminUseCase } from './application/commands/AssignTheatreAdminUseCase';




import { CreateScreenController } from './presentation/controllers/CreateScreenController';
import { CreateSeatController } from './presentation/controllers/CreateSeatController';
import { GetMyTheatresController } from './presentation/controllers/GetMyTheatresController';
import { GetTheatreOverviewController } from './presentation/controllers/GetTheatreOverviewController';

import { createTheatreRoutes } from './presentation/routes/theatre.routes';
import { createSeatRoutes } from './presentation/routes/seat.routes';
import { AssignTheatreAdminController } from './presentation/controllers/AssignTheatreAdminController';

export function buildTheatreModule(prisma: PrismaClient) {
  // Repositories & Query Service
  const theatreRepository = new PrismaTheatreRepository(prisma);
  const screenRepository = new PrismaScreenRepository(prisma);
  const seatRepository = new PrismaSeatRepository(prisma);
  const theatreQueryService = new PrismaTheatreQueryService(prisma);
  const theatreAccessPolicy = new PrismaTheatreAccessPolicy(prisma)
  const assignmentRepository = new PrismaTheatreAdminAssignmentRepository(prisma);

const theatreAdminUserReader = new PrismaTheatreAdminUserReader(prisma);
  


  // Use cases
  const createScreenUseCase = new CreateScreenUseCase(
    screenRepository,
    theatreRepository,
    theatreAccessPolicy
  );
  const createSeatUseCase = new CreateSeatUseCase(
    seatRepository,
    screenRepository,
    theatreAccessPolicy
  );
  const getMyTheatresUseCase = new GetMyTheatresUseCase(theatreQueryService);
  const getTheatreOverviewUseCase = new GetTheatreOverviewUseCase(
    theatreQueryService,
    theatreAccessPolicy,
  );

  const assignTheatreAdminUseCase = new AssignTheatreAdminUseCase(
    theatreRepository,
    assignmentRepository,
    theatreAdminUserReader
  )

  // Controllers
  const createScreenController = new CreateScreenController(
    createScreenUseCase,
  );
  const createSeatController = new CreateSeatController(createSeatUseCase);
  const getMyTheatresController = new GetMyTheatresController(
    getMyTheatresUseCase,
  );
  const getTheatreOverviewController = new GetTheatreOverviewController(
    getTheatreOverviewUseCase,
  );

  const assignTheatreAdminController = new AssignTheatreAdminController(assignTheatreAdminUseCase);

  // Routers
  const theatreRouter = createTheatreRoutes({
    getMyTheatresController,
    createScreenController,
    getTheatreOverviewController,
    assignTheatreAdminController,
  });

  const seatRouter = createSeatRoutes({
    createSeatController,
  });

  return {
    theatreRouter,
    seatRouter,
  };
}
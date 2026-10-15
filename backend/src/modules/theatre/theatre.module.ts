import { PrismaClient } from '@prisma/client';

import { PrismaTheatreRepository } from './infrastructure/persistence/repositories/PrismaTheatreRepository';
import { PrismaScreenRepository } from './infrastructure/persistence/repositories/PrismaScreenRepository';
import { PrismaSeatRepository } from './infrastructure/persistence/repositories/PrismaSeatRepository';
import { PrismaTheatreQueryService } from './infrastructure/persistence/queries/PrismaTheatreQueryService';
import { PrismaTheatreAccessPolicy } from './infrastructure/persistence/repositories/PrismaTheatreAccessPolicy';
import { PrismaTheatreAdminAssignmentRepository } from './infrastructure/persistence/repositories/PrismaTheatreAdminAssignmentRepository';
import { PrismaTheatreAdminUserReader } from './infrastructure/persistence/repositories/PrismaTheatreAdminUserReader';
import { PrismaTheatreAdminUserManager } from './infrastructure/persistence/repositories/PrismaTheatreAdminUserManager';
import { ResendEmailService } from '../../shared/infrastructure/email/ResendEmailService';

import { CreateScreenUseCase } from './application/commands/CreateScreenUseCase';
import { CreateSeatUseCase } from './application/commands/CreateSeatUseCase';
import { GetMyTheatresUseCase } from './application/queries/GetMyTheatresUseCase';
import { GetTheatreOverviewUseCase } from './application/queries/GetTheatreOverviewUseCase';
import { AssignTheatreAdminUseCase } from './application/commands/AssignTheatreAdminUseCase';
import { UpdateTheatreAdminAssignmentUseCase } from './application/commands/UpdateTheatreAdminAssignmentUseCase';
import { RevokeTheatreAdminAssignmentUseCase } from './application/commands/RevokeTheatreAdminAssignmentUseCase';
import { ListTheatresForAdminUseCase } from './application/queries/ListTheatresForAdminUseCase';
import { ListTheatreAdminAssignmentsUseCase } from './application/queries/ListTheatreAdminAssignmentsUseCase';
import { ListEligibleTheatreAdminsUseCase } from './application/queries/ListEligibleTheatreAdminsUseCase';
import { GetTheatreAdminStatsUseCase } from './application/queries/GetTheatreAdminStatsUseCase';
import { ListAllTheatreForAdminUseCase } from './application/queries/ListAllTheatreForAdminUseCase';

import { CreateScreenController } from './presentation/controllers/CreateScreenController';
import { CreateSeatController } from './presentation/controllers/CreateSeatController';
import { GetMyTheatresController } from './presentation/controllers/GetMyTheatresController';
import { GetTheatreOverviewController } from './presentation/controllers/GetTheatreOverviewController';
import { AssignTheatreAdminController } from './presentation/controllers/AssignTheatreAdminController';
import { UpdateTheatreAdminAssignmentController } from './presentation/controllers/UpdateTheatreAdminAssignmentController';
import { RevokeTheatreAdminAssignmentController } from './presentation/controllers/RevokeTheatreAdminAssignmentController';
import { ListTheatresForAdminController } from './presentation/controllers/ListTheatresForAdminController';
import { ListTheatreAdminAssignmentsController } from './presentation/controllers/ListTheatreAdminAssignmentsController';
import { ListEligibleTheatreAdminsController } from './presentation/controllers/ListEligibleTheatreAdminsController';
import { GetTheatreAdminStatsController } from './presentation/controllers/GetTheatreAdminStatsController';
import { ListAllTheatresController } from './presentation/controllers/ListAllTheatresController';

import { createTheatreRoutes } from './presentation/routes/theatre.routes';
import { createSeatRoutes } from './presentation/routes/seat.routes';

export function buildTheatreModule(prisma: PrismaClient) {
  // Repositories & Query Service
  const theatreRepository = new PrismaTheatreRepository(prisma);
  const screenRepository = new PrismaScreenRepository(prisma);
  const seatRepository = new PrismaSeatRepository(prisma);
  const theatreQueryService = new PrismaTheatreQueryService(prisma);
  const theatreAccessPolicy = new PrismaTheatreAccessPolicy(prisma);
  const assignmentRepository = new PrismaTheatreAdminAssignmentRepository(prisma);
  const theatreAdminUserReader = new PrismaTheatreAdminUserReader(prisma);
  const theatreAdminUserManager = new PrismaTheatreAdminUserManager(prisma);
  const emailService = new ResendEmailService();

  // Use cases
  const createScreenUseCase = new CreateScreenUseCase(
    screenRepository,
    theatreRepository,
    theatreAccessPolicy,
  );
  const createSeatUseCase = new CreateSeatUseCase(
    seatRepository,
    screenRepository,
    theatreAccessPolicy,
  );
  const getMyTheatresUseCase = new GetMyTheatresUseCase(theatreQueryService);
  const getTheatreOverviewUseCase = new GetTheatreOverviewUseCase(
    theatreQueryService,
    theatreAccessPolicy,
  );

  const assignTheatreAdminUseCase = new AssignTheatreAdminUseCase(
    theatreRepository,
    assignmentRepository,
    theatreAdminUserReader,
    theatreAdminUserManager,
    emailService,
  );
  const updateTheatreAdminAssignmentUseCase = new UpdateTheatreAdminAssignmentUseCase(
    assignmentRepository,
  );
  const revokeTheatreAdminAssignmentUseCase = new RevokeTheatreAdminAssignmentUseCase(
    assignmentRepository,
  );
  const listTheatresForAdminUseCase = new ListTheatresForAdminUseCase(
    theatreQueryService,
  );
  const listTheatreAdminAssignmentsUseCase = new ListTheatreAdminAssignmentsUseCase(
    assignmentRepository,
  );
  const listEligibleTheatreAdminsUseCase = new ListEligibleTheatreAdminsUseCase(
    theatreAdminUserReader,
  );
  const getTheatreAdminStatsUseCase = new GetTheatreAdminStatsUseCase(
    assignmentRepository,
  );
  const listAllTheatresUseCase = new ListAllTheatreForAdminUseCase(
    theatreQueryService,
  );

  // Controllers
  const createScreenController = new CreateScreenController(createScreenUseCase);
  const createSeatController = new CreateSeatController(createSeatUseCase);
  const getMyTheatresController = new GetMyTheatresController(getMyTheatresUseCase);
  const getTheatreOverviewController = new GetTheatreOverviewController(
    getTheatreOverviewUseCase,
  );

  const assignTheatreAdminController = new AssignTheatreAdminController(
    assignTheatreAdminUseCase,
  );
  const updateTheatreAdminAssignmentController = new UpdateTheatreAdminAssignmentController(
    updateTheatreAdminAssignmentUseCase,
  );
  const revokeTheatreAdminAssignmentController = new RevokeTheatreAdminAssignmentController(
    revokeTheatreAdminAssignmentUseCase,
  );
  const listTheatresForAdminController = new ListTheatresForAdminController(
    listTheatresForAdminUseCase,
  );
  const listTheatreAdminAssignmentsController = new ListTheatreAdminAssignmentsController(
    listTheatreAdminAssignmentsUseCase,
  );
  const listEligibleTheatreAdminsController = new ListEligibleTheatreAdminsController(
    listEligibleTheatreAdminsUseCase,
  );
  const getTheatreAdminStatsController = new GetTheatreAdminStatsController(
    getTheatreAdminStatsUseCase,
  );
  const listAllTheatresController = new ListAllTheatresController(
    listAllTheatresUseCase,
  );

  // Routers
  const theatreRouter = createTheatreRoutes({
    getMyTheatresController,
    createScreenController,
    getTheatreOverviewController,
    assignTheatreAdminController,
    updateTheatreAdminAssignmentController,
    revokeTheatreAdminAssignmentController,
    listTheatresForAdminController,
    listTheatreAdminAssignmentsController,
    listEligibleTheatreAdminsController,
    getTheatreAdminStatsController,
    listAllTheatresController,
  });

  const seatRouter = createSeatRoutes({
    createSeatController,
  });

  return {
    theatreRouter,
    seatRouter,
  };
}
import { PrismaClient } from '@prisma/client';

// !Repositories

import { PrismaTheatreRepository } from './infrastructure/persistence/repositories/PrismaTheatreRepository';
import { PrismaScreenRepository } from './infrastructure/persistence/repositories/PrismaScreenRepository';
import { PrismaSeatRepository } from './infrastructure/persistence/repositories/PrismaSeatRepository';
import { PrismaTheatreQueryService } from './infrastructure/persistence/queries/PrismaTheatreQueryService';
import { PrismaTheatreAccessPolicy } from './infrastructure/persistence/repositories/PrismaTheatreAccessPolicy';
import { PrismaTheatreAdminAssignmentRepository } from './infrastructure/persistence/repositories/PrismaTheatreAdminAssignmentRepository';
import { PrismaTheatreAdminUserReader } from './infrastructure/persistence/repositories/PrismaTheatreAdminUserReader';
import { PrismaTheatreAdminUserManager } from './infrastructure/persistence/repositories/PrismaTheatreAdminUserManager';
import { ResendEmailService } from '../../shared/infrastructure/email/ResendEmailService';
import { IStorageService } from '../../shared/application/ports/IStorageService';


// !Services
import { TheatreSlugService } from './application/services/TheatreSlugService';
import { ResolveTheatreLocationService } from './application/services/ResolveTheatreLocationService';

import { CreateTheatreUseCase } from './application/commands/CreateTheatreUseCase';
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
import { ListCitiesUseCase } from './application/queries/ListCitiesUseCase';
import { CreateFacilityUseCase } from './application/commands/CreateFacilityUseCase';
import { EditFacilityUseCase } from './application/commands/EditFacilityUseCase';
import { ToggleFacilityStatusUseCase } from './application/commands/ToggleFacilityStatusUseCase';
import { ListFacilitiesUseCase } from './application/queries/ListFacilitiesUseCase';
import { ListActiveFacilitiesUseCase } from './application/queries/ListActiveFacilitiesUseCase';
import { PrismaFacilityRepository } from './infrastructure/persistence/repositories/PrismaFacilityRepository';

import { CreateTheatreController } from './presentation/controllers/CreateTheatreController';
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
import { ListCitiesController } from './presentation/controllers/ListCitiesController';
import { CreateFacilityController } from './presentation/controllers/CreateFacilityController';
import { EditFacilityController } from './presentation/controllers/EditFacilityController';
import { ToggleFacilityStatusController } from './presentation/controllers/ToggleFacilityStatusController';
import { ListFacilitiesController } from './presentation/controllers/ListFacilitiesController';
import { ListActiveFacilitiesController } from './presentation/controllers/ListActiveFacilitiesController';

import { createTheatreRoutes } from './presentation/routes/theatre.routes';
import { createSeatRoutes } from './presentation/routes/seat.routes';
import { PrismaTheatreLocationRepository } from './infrastructure/persistence/repositories/PrismaTheatreLocationRepository';

export function buildTheatreModule(prisma: PrismaClient, storageService?: IStorageService) {
  // Repositories & Query Service
  const theatreRepository = new PrismaTheatreRepository(prisma);
  const facilityRepository = new PrismaFacilityRepository(prisma);
  const screenRepository = new PrismaScreenRepository(prisma);
  const seatRepository = new PrismaSeatRepository(prisma);
  const theatreQueryService = new PrismaTheatreQueryService(prisma);
  const theatreAccessPolicy = new PrismaTheatreAccessPolicy(prisma);
  const assignmentRepository = new PrismaTheatreAdminAssignmentRepository(prisma);
  const theatreAdminUserReader = new PrismaTheatreAdminUserReader(prisma);
  const theatreAdminUserManager = new PrismaTheatreAdminUserManager(prisma);
  const theatreLocationRepository = new PrismaTheatreLocationRepository(prisma);
  const emailService = new ResendEmailService();



  // Services
  const resolveTheatreLocationService = new ResolveTheatreLocationService(theatreLocationRepository);


  // Application services & use cases
  const theatreSlugService = new TheatreSlugService(theatreRepository);
  const createTheatreUseCase = new CreateTheatreUseCase(
    theatreRepository,
    theatreSlugService,
    resolveTheatreLocationService,
    storageService,
  );
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
  const listCitiesUseCase = new ListCitiesUseCase(theatreQueryService);

  // Facility Use Cases
  const createFacilityUseCase = new CreateFacilityUseCase(facilityRepository);
  const editFacilityUseCase = new EditFacilityUseCase(facilityRepository);
  const toggleFacilityStatusUseCase = new ToggleFacilityStatusUseCase(facilityRepository);
  const listFacilitiesUseCase = new ListFacilitiesUseCase(theatreQueryService);
  const listActiveFacilitiesUseCase = new ListActiveFacilitiesUseCase(theatreQueryService);

  // Controllers
  const createTheatreController = new CreateTheatreController(createTheatreUseCase);
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
  const listCitiesController = new ListCitiesController(listCitiesUseCase);

  // Facility Controllers
  const createFacilityController = new CreateFacilityController(createFacilityUseCase);
  const editFacilityController = new EditFacilityController(editFacilityUseCase);
  const toggleFacilityStatusController = new ToggleFacilityStatusController(toggleFacilityStatusUseCase);
  const listFacilitiesController = new ListFacilitiesController(listFacilitiesUseCase);
  const listActiveFacilitiesController = new ListActiveFacilitiesController(listActiveFacilitiesUseCase);

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
    createTheatreController,
    listCitiesController,
    listFacilitiesController,
    listActiveFacilitiesController,
    createFacilityController,
    editFacilityController,
    toggleFacilityStatusController,
  });

  const seatRouter = createSeatRoutes({
    createSeatController,
  });

  return {
    theatreRouter,
    seatRouter,
  };
}
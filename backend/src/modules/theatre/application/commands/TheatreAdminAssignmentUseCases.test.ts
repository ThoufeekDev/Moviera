import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AssignTheatreAdminUseCase } from './AssignTheatreAdminUseCase';
import { UpdateTheatreAdminAssignmentUseCase } from './UpdateTheatreAdminAssignmentUseCase';
import { RevokeTheatreAdminAssignmentUseCase } from './RevokeTheatreAdminAssignmentUseCase';
import { ListTheatresForAdminUseCase } from '../queries/ListTheatresForAdminUseCase';
import { ListTheatreAdminAssignmentsUseCase } from '../queries/ListTheatreAdminAssignmentsUseCase';
import { ListEligibleTheatreAdminsUseCase } from '../queries/ListEligibleTheatreAdminsUseCase';
import { GetTheatreAdminStatsUseCase } from '../queries/GetTheatreAdminStatsUseCase';
import { Role } from '../../../../shared/enums/Role';
import { TheatreAdminAssignmentRole } from '../../domain/enums/TheatreAdminAssignmentRole';
import { BadRequestError } from '../../../../shared/errors/BadRequestError';
import { NotFoundError } from '../../../../shared/errors/NotFoundError';
import { ConflictError } from '../../../../shared/errors/ConflictError';

describe('Theatre Admin Management Use Cases', () => {
  let mockTheatreRepo: any;
  let mockAssignmentRepo: any;
  let mockUserReader: any;
  let mockQueryService: any;

  beforeEach(() => {
    mockTheatreRepo = {
      findById: vi.fn(),
    };
    mockAssignmentRepo = {
      findByUserAndTheatre: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      updateActiveStatus: vi.fn(),
      updateAssignment: vi.fn(),
      delete: vi.fn(),
      findActiveByTheatre: vi.fn(),
      findActivePrimaryManagerByTheatre: vi.fn(),
      findAll: vi.fn(),
      getStatistics: vi.fn(),
    };
    mockUserReader = {
      findById: vi.fn(),
      findEligibleAdmins: vi.fn(),
    };
    mockQueryService = {
      listForSuperAdmin: vi.fn(),
    };
  });

  describe('AssignTheatreAdminUseCase', () => {
    it('should assign a theatre admin successfully', async () => {
      mockUserReader.findById.mockResolvedValue({
        id: 'usr-1',
        role: Role.THEATRE_ADMIN,
        isActive: true,
      });
      mockTheatreRepo.findById.mockResolvedValue({
        id: 'th-1',
        isActive: true,
      });
      mockAssignmentRepo.findByUserAndTheatre.mockResolvedValue(null);
      mockAssignmentRepo.create.mockResolvedValue({
        id: 'asg-1',
        userId: 'usr-1',
        theatreId: 'th-1',
        role: TheatreAdminAssignmentRole.OPERATIONS_SUPERVISOR,
        isActive: true,
      });

      const useCase = new AssignTheatreAdminUseCase(
        mockTheatreRepo,
        mockAssignmentRepo,
        mockUserReader,
      );

      const result = await useCase.execute({
        userId: 'usr-1',
        theatreId: 'th-1',
      });

      expect(result.id).toBe('asg-1');
      expect(mockAssignmentRepo.create).toHaveBeenCalledWith(
        'usr-1',
        'th-1',
        TheatreAdminAssignmentRole.OPERATIONS_SUPERVISOR,
      );
    });

    it('should reject assigning primary manager when one is already active', async () => {
      mockUserReader.findById.mockResolvedValue({
        id: 'usr-2',
        role: Role.THEATRE_ADMIN,
        isActive: true,
      });
      mockTheatreRepo.findById.mockResolvedValue({
        id: 'th-1',
        isActive: true,
      });
      mockAssignmentRepo.findActivePrimaryManagerByTheatre.mockResolvedValue({
        id: 'asg-1',
        userId: 'usr-1',
        theatreId: 'th-1',
        role: TheatreAdminAssignmentRole.PRIMARY_MANAGER,
        isActive: true,
      });

      const useCase = new AssignTheatreAdminUseCase(
        mockTheatreRepo,
        mockAssignmentRepo,
        mockUserReader,
      );

      await expect(
        useCase.execute({
          userId: 'usr-2',
          theatreId: 'th-1',
          role: TheatreAdminAssignmentRole.PRIMARY_MANAGER,
        }),
      ).rejects.toThrow(BadRequestError);
    });

    it('should reactivate existing assignment if found', async () => {
      mockUserReader.findById.mockResolvedValue({
        id: 'usr-1',
        role: Role.THEATRE_ADMIN,
        isActive: true,
      });
      mockTheatreRepo.findById.mockResolvedValue({
        id: 'th-1',
        isActive: true,
      });
      mockAssignmentRepo.findByUserAndTheatre.mockResolvedValue({
        id: 'asg-1',
        userId: 'usr-1',
        theatreId: 'th-1',
        role: TheatreAdminAssignmentRole.BOX_OFFICE_LEAD,
        isActive: false,
      });
      mockAssignmentRepo.updateAssignment.mockResolvedValue({
        id: 'asg-1',
        userId: 'usr-1',
        theatreId: 'th-1',
        role: TheatreAdminAssignmentRole.OPERATIONS_SUPERVISOR,
        isActive: true,
      });

      const useCase = new AssignTheatreAdminUseCase(
        mockTheatreRepo,
        mockAssignmentRepo,
        mockUserReader,
      );

      const result = await useCase.execute({
        userId: 'usr-1',
        theatreId: 'th-1',
        role: TheatreAdminAssignmentRole.OPERATIONS_SUPERVISOR,
      });

      expect(mockAssignmentRepo.updateAssignment).toHaveBeenCalledWith('asg-1', {
        isActive: true,
        role: TheatreAdminAssignmentRole.OPERATIONS_SUPERVISOR,
      });
      expect(result.isActive).toBe(true);
    });

    it('should throw ConflictError if user is already actively assigned with the same role', async () => {
      mockUserReader.findById.mockResolvedValue({
        id: 'usr-1',
        name: 'Thoufeek',
        email: 'thoufeek.dev@gmail.com',
        role: Role.THEATRE_ADMIN,
        isActive: true,
      });
      mockTheatreRepo.findById.mockResolvedValue({
        id: 'th-1',
        isActive: true,
      });
      mockAssignmentRepo.findByUserAndTheatre.mockResolvedValue({
        id: 'asg-1',
        userId: 'usr-1',
        theatreId: 'th-1',
        role: TheatreAdminAssignmentRole.OPERATIONS_SUPERVISOR,
        isActive: true,
      });

      const useCase = new AssignTheatreAdminUseCase(
        mockTheatreRepo,
        mockAssignmentRepo,
        mockUserReader,
      );

      await expect(
        useCase.execute({
          userId: 'usr-1',
          theatreId: 'th-1',
          role: TheatreAdminAssignmentRole.OPERATIONS_SUPERVISOR,
        }),
      ).rejects.toThrow(ConflictError);
    });

    it('should create new theatre admin by email, generate temporary credentials and dispatch email', async () => {
      mockTheatreRepo.findById.mockResolvedValue({
        id: 'th-1',
        name: 'Grand Cineplex',
        isActive: true,
      });
      const mockUserManager = {
        findByEmail: vi.fn().mockResolvedValue(null),
        createTheatreAdmin: vi.fn().mockResolvedValue({
          id: 'usr-new-1',
          name: 'Sarah Connor',
          email: 'sarah@cineplex.com',
          phone: '+1234567890',
          role: Role.THEATRE_ADMIN,
          isActive: true,
        }),
        promoteToTheatreAdmin: vi.fn(),
      };
      const mockEmailService = {
        sendOtpEmail: vi.fn(),
        sendTheatreAdminCredentialsEmail: vi.fn().mockResolvedValue(undefined),
      };
      mockAssignmentRepo.findByUserAndTheatre.mockResolvedValue(null);
      mockAssignmentRepo.create.mockResolvedValue({
        id: 'asg-new',
        userId: 'usr-new-1',
        theatreId: 'th-1',
        role: TheatreAdminAssignmentRole.PRIMARY_MANAGER,
        isActive: true,
      });
      mockAssignmentRepo.findActivePrimaryManagerByTheatre.mockResolvedValue(null);

      const useCase = new AssignTheatreAdminUseCase(
        mockTheatreRepo,
        mockAssignmentRepo,
        mockUserReader,
        mockUserManager,
        mockEmailService as any,
      );

      const result = await useCase.execute({
        email: 'sarah@cineplex.com',
        name: 'Sarah Connor',
        phone: '+1234567890',
        theatreId: 'th-1',
        role: TheatreAdminAssignmentRole.PRIMARY_MANAGER,
      });

      expect(result.id).toBe('asg-new');
      expect(result.isNewUser).toBe(true);
      expect(result.temporaryPassword).toBeDefined();
      expect(result.temporaryPassword?.length).toBeGreaterThanOrEqual(10);
      expect(result.emailSent).toBe(true);
      expect(mockUserManager.createTheatreAdmin).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'sarah@cineplex.com',
          name: 'Sarah Connor',
          phone: '+1234567890',
        }),
      );
      expect(mockEmailService.sendTheatreAdminCredentialsEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'sarah@cineplex.com',
          theatreName: 'Grand Cineplex',
          temporaryPassword: result.temporaryPassword,
        }),
      );
    });

    it('should promote existing customer to theatre admin when assigned by email', async () => {
      mockTheatreRepo.findById.mockResolvedValue({
        id: 'th-1',
        name: 'Grand Cineplex',
        isActive: true,
      });
      const mockUserManager = {
        findByEmail: vi.fn().mockResolvedValue({
          id: 'usr-cust-1',
          name: 'Existing Customer',
          email: 'customer@moviera.com',
          role: Role.USER,
          isActive: true,
        }),
        createTheatreAdmin: vi.fn(),
        promoteToTheatreAdmin: vi.fn().mockResolvedValue({
          id: 'usr-cust-1',
          name: 'Existing Customer',
          email: 'customer@moviera.com',
          role: Role.THEATRE_ADMIN,
          isActive: true,
        }),
      };
      const mockEmailService = {
        sendOtpEmail: vi.fn(),
        sendTheatreAdminCredentialsEmail: vi.fn().mockResolvedValue(undefined),
      };
      mockAssignmentRepo.findByUserAndTheatre.mockResolvedValue(null);
      mockAssignmentRepo.create.mockResolvedValue({
        id: 'asg-promoted',
        userId: 'usr-cust-1',
        theatreId: 'th-1',
        role: TheatreAdminAssignmentRole.OPERATIONS_SUPERVISOR,
        isActive: true,
      });

      const useCase = new AssignTheatreAdminUseCase(
        mockTheatreRepo,
        mockAssignmentRepo,
        mockUserReader,
        mockUserManager,
        mockEmailService as any,
      );

      const result = await useCase.execute({
        email: 'customer@moviera.com',
        theatreId: 'th-1',
        role: TheatreAdminAssignmentRole.OPERATIONS_SUPERVISOR,
      });

      expect(result.id).toBe('asg-promoted');
      expect(mockUserManager.promoteToTheatreAdmin).toHaveBeenCalledWith(
        'usr-cust-1',
        expect.anything(),
      );
      expect(result.isNewUser).toBe(false);
      expect(mockEmailService.sendTheatreAdminCredentialsEmail).toHaveBeenCalled();
    });
  });

  describe('UpdateTheatreAdminAssignmentUseCase', () => {
    it('should update assignment active status', async () => {
      mockAssignmentRepo.findById.mockResolvedValue({
        id: 'asg-1',
        userId: 'usr-1',
        theatreId: 'th-1',
        role: TheatreAdminAssignmentRole.OPERATIONS_SUPERVISOR,
        isActive: true,
      });
      mockAssignmentRepo.updateAssignment.mockResolvedValue({
        id: 'asg-1',
        userId: 'usr-1',
        theatreId: 'th-1',
        role: TheatreAdminAssignmentRole.OPERATIONS_SUPERVISOR,
        isActive: false,
      });

      const useCase = new UpdateTheatreAdminAssignmentUseCase(mockAssignmentRepo);

      const result = await useCase.execute({
        assignmentId: 'asg-1',
        isActive: false,
      });

      expect(result.isActive).toBe(false);
      expect(mockAssignmentRepo.updateAssignment).toHaveBeenCalledWith('asg-1', {
        isActive: false,
        role: undefined,
      });
    });

    it('should throw NotFoundError if assignment does not exist', async () => {
      mockAssignmentRepo.findById.mockResolvedValue(null);

      const useCase = new UpdateTheatreAdminAssignmentUseCase(mockAssignmentRepo);

      await expect(
        useCase.execute({
          assignmentId: 'invalid-id',
          isActive: false,
        }),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('RevokeTheatreAdminAssignmentUseCase', () => {
    it('should delete assignment record successfully', async () => {
      mockAssignmentRepo.findById.mockResolvedValue({
        id: 'asg-1',
        userId: 'usr-1',
        theatreId: 'th-1',
      });
      mockAssignmentRepo.delete.mockResolvedValue(undefined);

      const useCase = new RevokeTheatreAdminAssignmentUseCase(mockAssignmentRepo);

      await useCase.execute({ assignmentId: 'asg-1' });

      expect(mockAssignmentRepo.delete).toHaveBeenCalledWith('asg-1');
    });

    it('should throw NotFoundError when assignment to revoke does not exist', async () => {
      mockAssignmentRepo.findById.mockResolvedValue(null);

      const useCase = new RevokeTheatreAdminAssignmentUseCase(mockAssignmentRepo);

      await expect(useCase.execute({ assignmentId: 'not-found' })).rejects.toThrow(
        NotFoundError,
      );
    });
  });

  describe('ListTheatresForAdminUseCase & Stats', () => {
    it('should query theatres for super admin', async () => {
      const mockTheatres = [
        {
          id: 'th-1',
          name: 'PVR INOX',
          screensCount: 4,
          totalSeats: 600,
          assignedAdminsCount: 1,
        },
      ];
      mockQueryService.listForSuperAdmin.mockResolvedValue(mockTheatres);

      const useCase = new ListTheatresForAdminUseCase(mockQueryService);
      const result = await useCase.execute({ query: { status: 'ALL' } });

      expect(result).toHaveLength(1);
      expect(mockQueryService.listForSuperAdmin).toHaveBeenCalledWith({ status: 'ALL' });
    });

    it('should query theatre admin stats', async () => {
      mockAssignmentRepo.getStatistics.mockResolvedValue({
        totalCinemas: 10,
        assignedCinemas: 8,
        unassignedCinemas: 2,
        totalAdmins: 12,
        activeAdmins: 11,
        suspendedAdmins: 1,
      });

      const useCase = new GetTheatreAdminStatsUseCase(mockAssignmentRepo);
      const stats = await useCase.execute();

      expect(stats.totalCinemas).toBe(10);
      expect(stats.assignedCinemas).toBe(8);
      expect(stats.unassignedCinemas).toBe(2);
    });
  });
});

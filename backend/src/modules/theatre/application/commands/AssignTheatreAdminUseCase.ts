import type { IUseCase } from '../../../../shared/application/interfaces/IUseCase';
import { ITheatreAdminAssignmentRepository } from '../../domain/repositories/ITheatreAdminAssignmentRepository';
import { ITheatreRepository } from '../../domain/repositories/ITheatreRepository';
import { ITheatreAdminUserReader } from '../ports/ITheatreAdminUserReader';
import type { TheatreAdminAssignmentRecord } from '../../domain/repositories/ITheatreAdminAssignmentRepository';
import { AssignTheatreAdminDTO } from '../dtos/AssignTheatreAdminDTO';
import { BadRequestError } from '../../../../shared/errors/BadRequestError';
import { NotFoundError } from '../../../../shared/errors/NotFoundError';
import { Role } from '../../../../shared/enums/Role';
import { TheatreAdminAssignmentRole } from '@prisma/client';

export class AssignTheatreAdminUseCase implements IUseCase<
  AssignTheatreAdminDTO,
  TheatreAdminAssignmentRecord
> {
  constructor(
    private readonly theatreRepository: ITheatreRepository,
    private readonly assignmentRepository: ITheatreAdminAssignmentRepository,
    private readonly userReader: ITheatreAdminUserReader,
  ) {}

  async execute(request: AssignTheatreAdminDTO): Promise<TheatreAdminAssignmentRecord> {
    if (!request.userId || !request.theatreId) {
      throw new BadRequestError('User ID and theatre ID are required');
    }

    const role = (request.role as TheatreAdminAssignmentRole) ?? TheatreAdminAssignmentRole.OPERATIONS_SUPERVISOR;

    const user = await this.userReader.findById(request.userId);

    if (!user || !user.isActive) throw new NotFoundError('Active user not found');

    if (user.role !== Role.THEATRE_ADMIN) {
      throw new BadRequestError('User must have the Theatre_Admin role');
    }

    const theatre = await this.theatreRepository.findById(request.theatreId);

    if (!theatre || !theatre.isActive) throw new NotFoundError('Active theatre not found');

    // If assigning as Primary Manager, ensure no other active Primary Manager exists for this theatre
    if (role === TheatreAdminAssignmentRole.PRIMARY_MANAGER) {
      const currentPrimaryManager = await this.assignmentRepository.findActivePrimaryManagerByTheatre(request.theatreId);

      if (currentPrimaryManager && currentPrimaryManager.userId !== request.userId) {
        throw new BadRequestError('This theatre already has an active primary manager');
      }
    }

    // Reuse or update existing assignment if one exists
    const existingAssignment = await this.assignmentRepository.findByUserAndTheatre(
      request.userId,
      request.theatreId,
    );

    if (existingAssignment) {
      if (existingAssignment.isActive && existingAssignment.role === role) {
        return existingAssignment;
      }

      return this.assignmentRepository.updateAssignment(existingAssignment.id, {
        isActive: true,
        role,
      });
    }

    return this.assignmentRepository.create(request.userId, request.theatreId, role);
  }
}

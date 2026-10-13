import type { IUseCase } from '../../../../shared/application/interfaces/IUseCase';
import { ITheatreAdminAssignmentRepository } from '../../domain/repositories/ITheatreAdminAssignmentRepository';
import type { TheatreAdminAssignmentRecord } from '../../domain/repositories/ITheatreAdminAssignmentRepository';
import { UpdateTheatreAdminAssignmentDTO } from '../dtos/UpdateTheatreAdminAssignmentDTO';
import { BadRequestError } from '../../../../shared/errors/BadRequestError';
import { NotFoundError } from '../../../../shared/errors/NotFoundError';
import { TheatreAdminAssignmentRole } from '@prisma/client';

export class UpdateTheatreAdminAssignmentUseCase implements IUseCase<
  UpdateTheatreAdminAssignmentDTO,
  TheatreAdminAssignmentRecord
> {
  constructor(
    private readonly assignmentRepository: ITheatreAdminAssignmentRepository,
  ) {}

  async execute(request: UpdateTheatreAdminAssignmentDTO): Promise<TheatreAdminAssignmentRecord> {
    if (!request.assignmentId) {
      throw new BadRequestError('Assignment ID is required');
    }

    if (request.isActive === undefined && request.role === undefined) {
      throw new BadRequestError('Either isActive or role must be provided to update');
    }

    const assignment = await this.assignmentRepository.findById(request.assignmentId);
    if (!assignment) {
      throw new NotFoundError('Theatre admin assignment not found');
    }

    const targetRole = request.role
      ? (request.role as TheatreAdminAssignmentRole)
      : assignment.role;
    const targetIsActive = request.isActive !== undefined ? request.isActive : assignment.isActive;

    // If changing role to PRIMARY_MANAGER and assignment will be active, check primary manager conflict
    if (targetRole === TheatreAdminAssignmentRole.PRIMARY_MANAGER && targetIsActive) {
      const currentPrimaryManager = await this.assignmentRepository.findActivePrimaryManagerByTheatre(
        assignment.theatreId,
      );
           
      // ! handle no 2 priamry manager
      if (currentPrimaryManager && currentPrimaryManager.id !== assignment.id) {
        throw new BadRequestError('This theatre already has an active primary manager');
      }
    }

    return this.assignmentRepository.updateAssignment(assignment.id, {
      isActive: request.isActive,
      role: request.role ? (request.role as TheatreAdminAssignmentRole) : undefined,
    });
  }
}

import type { IUseCase } from '../../../../shared/application/interfaces/IUseCase';
import { ITheatreAdminAssignmentRepository } from '../../domain/repositories/ITheatreAdminAssignmentRepository';
import { BadRequestError } from '../../../../shared/errors/BadRequestError';
import { NotFoundError } from '../../../../shared/errors/NotFoundError';

export interface RevokeTheatreAdminAssignmentRequest {
  assignmentId: string;
}

export class RevokeTheatreAdminAssignmentUseCase implements IUseCase<RevokeTheatreAdminAssignmentRequest, void> {
  constructor(
    private readonly assignmentRepository: ITheatreAdminAssignmentRepository,
  ) {}

  async execute(request: RevokeTheatreAdminAssignmentRequest): Promise<void> {
    if (!request.assignmentId) {
      throw new BadRequestError('Assignment ID is required');
    }

    const assignment = await this.assignmentRepository.findById(request.assignmentId);
    if (!assignment) {
      throw new NotFoundError('Theatre admin assignment not found');
    }

    await this.assignmentRepository.delete(request.assignmentId);
  }
}

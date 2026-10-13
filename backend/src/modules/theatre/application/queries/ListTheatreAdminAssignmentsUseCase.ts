import type { IUseCase } from '../../../../shared/application/interfaces/IUseCase';
import {
  ITheatreAdminAssignmentRepository,
  TheatreAdminAssignmentDetails,
} from '../../domain/repositories/ITheatreAdminAssignmentRepository';
import { TheatreAdminAssignmentRole } from '../../domain/enums/TheatreAdminAssignmentRole';

export interface ListTheatreAdminAssignmentsRequest {
  query?: {
    theatreId?: string;
    role?: TheatreAdminAssignmentRole;
    status?: 'ALL' | 'ACTIVE' | 'SUSPENDED';
    search?: string;
  };
}

export class ListTheatreAdminAssignmentsUseCase implements IUseCase<
  ListTheatreAdminAssignmentsRequest,
  TheatreAdminAssignmentDetails[]
> {
  constructor(
    private readonly assignmentRepository: ITheatreAdminAssignmentRepository,
  ) {}

  async execute(request: ListTheatreAdminAssignmentsRequest): Promise<TheatreAdminAssignmentDetails[]> {
    let isActive: boolean | undefined = undefined;
    if (request.query?.status === 'ACTIVE') isActive = true;
    if (request.query?.status === 'SUSPENDED') isActive = false;

    return this.assignmentRepository.findAll({
      theatreId: request.query?.theatreId,
      role: request.query?.role,
      isActive,
      search: request.query?.search,
    });
  }
}

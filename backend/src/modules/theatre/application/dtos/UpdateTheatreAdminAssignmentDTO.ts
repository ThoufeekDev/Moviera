import type { TheatreAdminAssignmentRole } from '../../domain/enums/TheatreAdminAssignmentRole';

export interface UpdateTheatreAdminAssignmentDTO {
  assignmentId: string;
  isActive?: boolean;
  role?: TheatreAdminAssignmentRole;
}

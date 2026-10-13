import type { TheatreAdminAssignmentRole } from "../../domain/enums/TheatreAdminAssignmentRole";

export interface AssignTheatreAdminDTO {
  userId: string;
  theatreId: string;
  role?: TheatreAdminAssignmentRole;
}

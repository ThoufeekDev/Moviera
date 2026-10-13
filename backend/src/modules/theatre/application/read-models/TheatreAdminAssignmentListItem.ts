import { TheatreAdminAssignmentRole } from "../../domain/enums/TheatreAdminAssignmentRole";



export interface TheatreAdminAssignmentListItem {
    id: string;
    userId: string;
    theatreId: string;
    name: string;
    email: string;
    phone: string | null;
    isActive: boolean;
    role:TheatreAdminAssignmentRole
    assignmentAt: Date;
}
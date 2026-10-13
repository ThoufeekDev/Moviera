import type { TheatreAdminAssignmentListItem } from "../read-models/TheatreAdminAssignmentListItem";


export interface ITheatreAdminAssignmentQueryService {
    findByTheatre(theatreId: string): Promise<TheatreAdminAssignmentListItem>;
}
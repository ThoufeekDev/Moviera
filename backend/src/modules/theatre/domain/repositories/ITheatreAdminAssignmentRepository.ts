export interface TheatreAdminAssignmentRecord {
    id: string;
    userId: string;
    theatreId: string;
    isActive: boolean;
}


export interface ITheatreAdminAssignmentRepository {
    findByUserAndTheatre(userId: string, theatreId: string): Promise<TheatreAdminAssignmentRecord | null>;

    create(userId: string, theatreId: string): Promise<TheatreAdminAssignmentRecord>;

    updateActiveStatus(assignmentId: string, isActive: boolean): Promise<TheatreAdminAssignmentRecord>;

    findActiveByTheatre(theatreId:string):Promise<TheatreAdminAssignmentRecord[]>
}
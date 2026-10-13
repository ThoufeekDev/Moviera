import type { Role } from "../../../../shared/enums/Role";


export interface TheatreAccessActor {
    userId: string;
    role: Role;
}


export interface ITheatreAccessPolicy {
    canManage(actor:TheatreAccessActor,theatreId:string):Promise<boolean>
}
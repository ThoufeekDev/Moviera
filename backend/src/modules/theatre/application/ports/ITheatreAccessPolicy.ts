import type { Role } from "../../../../shared/enums/Role";


export interface TheatreAccessActor {
    userId: string;
    role: Role;
}


export interface ITheatreAccessPolicy {
    assertCanManage(actor:TheatreAccessActor,theatreId:string):Promise<void>
}
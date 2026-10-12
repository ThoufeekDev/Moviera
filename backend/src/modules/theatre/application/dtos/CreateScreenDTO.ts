import { TheatreAccessActor } from "../ports/ITheatreAccessPolicy";

export interface CreateScreenDTO {
    theatreId: string;
    actor: TheatreAccessActor;
    name: string;
  
}
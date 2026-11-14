import type { TheatreAccessActor } from '../../../theatre';

export interface CancelShowDTO {
  actor: TheatreAccessActor;
  showId: string;
}



import type { TheatreAccessActor } from '../ports/ITheatreAccessPolicy';

export interface UpdateSeatLayoutDTO {
  screenId: string;
  actor: TheatreAccessActor;
  seats: {
    seatId: string;
    x: number;
    y: number;
    rotation: number;
  }[];
}

import type { SeatType } from '../../domain/enums/SeatType';
import type { TheatreAccessActor } from '../ports/ITheatreAccessPolicy';

export interface UpdateSeatDTO {
  seatId: string;
  actor: TheatreAccessActor;
  type?: SeatType;
  isActive?: boolean;
}
import type { SeatType } from '../../domain/enums/SeatType';
import type { TheatreAccessActor } from '../ports/ITheatreAccessPolicy';

export interface UpdateSeatPropertiesItemDTO {
  seatId: string;
  type?: SeatType;
  isActive?: boolean;
}

export interface UpdateSeatPropertiesDTO {
  screenId: string;
  actor: TheatreAccessActor;
  seats: UpdateSeatPropertiesItemDTO[];
}


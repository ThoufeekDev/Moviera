import type { SeatType } from '../../domain/enums/SeatType';
import type { TheatreAccessActor } from '../ports/ITheatreAccessPolicy';

export interface CreateSeatDTO {
  screenId: string;
  actor:TheatreAccessActor,
  rowLabel: string;
  seatNumber: number;
  x: number;
  y: number;
  rotation?: number;
  type: SeatType;
}
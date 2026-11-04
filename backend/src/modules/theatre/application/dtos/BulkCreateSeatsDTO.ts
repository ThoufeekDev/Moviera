import { TheatreAccessActor } from "../ports/ITheatreAccessPolicy";
import { SeatType } from "../../domain/enums/SeatType";
export interface BulkCreateSeatsDTO {
  screenId: string;
  actor: TheatreAccessActor;
  rows: {
    rowLabel: string;
    seatCount: number;
      type: SeatType;
      rotation?: number;
  }[];
}
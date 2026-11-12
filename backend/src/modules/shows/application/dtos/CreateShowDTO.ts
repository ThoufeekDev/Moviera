import type { TheatreAccessActor } from '../../../theatre';
import type { SeatType } from '../../../theatre';


export interface CreateShowDTO {
  actor: TheatreAccessActor;
  movieId: string;
  screenId: string;
  cinemaFormatId: string;
  startTime: Date;
  endTime?: Date;
  basePrice: number;
  priceAdjustments: Record<SeatType, number>;
}
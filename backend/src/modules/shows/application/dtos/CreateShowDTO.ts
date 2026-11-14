import type { TheatreAccessActor, SeatType } from '../../../theatre';

export interface CreateShowDTO {
  actor: TheatreAccessActor;
  movieId: string;
  screenId: string;
  cinemaFormatId: string;
  startTime: Date;
  endTime?: Date;
  basePrice: number;
  priceAdjustments?: Partial<Record<SeatType, number>>;
}

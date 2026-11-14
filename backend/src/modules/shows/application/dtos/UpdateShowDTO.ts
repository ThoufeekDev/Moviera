import type { TheatreAccessActor, SeatType } from '../../../theatre';

export interface UpdateShowDTO {
  actor: TheatreAccessActor;
  showId: string;
  movieId?: string;
  cinemaFormatId?: string;
  startTime?: Date;
  endTime?: Date;
  basePrice?: number;
  priceAdjustments?: Partial<Record<SeatType, number>>;
}


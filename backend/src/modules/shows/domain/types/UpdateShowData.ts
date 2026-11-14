import type { ShowSeatInventoryInput } from "./CreateShowData";

export interface UpdateShowData {
  showId: string;
  screenId: string;
  movieId: string;
  cinemaFormatId: string;
  startTime: Date;
  endTime: Date;
  basePrice: number;
  cleaningBufferMinutes?: number;
  seats?: ShowSeatInventoryInput[];
}


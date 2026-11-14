import { ShowStatus } from "../enums/ShowStatus";

export interface ShowSeatInventoryInput {
  seatId: string;
  price: number;
  priceAdjustment: number;
}

export interface CreateShowData {
  movieId: string;
  screenId: string;
  cinemaFormatId: string;
  startTime: Date;
  endTime: Date;
  basePrice: number;
  status: typeof ShowStatus.DRAFT;
  cleaningBufferMinutes?: number;
  seats: ShowSeatInventoryInput[];
}

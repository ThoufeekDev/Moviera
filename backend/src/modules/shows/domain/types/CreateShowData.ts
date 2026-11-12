import { ShowStatus } from "../enums/ShowStatus";

export interface CreateShowData {
  movieId: string;
  screenId: string;
  cinemaFormatId: string;
  startTime: Date;
  endTime: Date;
  basePrice: number;
  status: typeof ShowStatus.DRAFT ;

  seats: {
    seatId: string;
    price: number;
    priceAdjustment: number;
  }[];
}
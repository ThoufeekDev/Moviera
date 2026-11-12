import type { ShowStatus } from "../enums/ShowStatus";


export interface ShowProps {
  id: string;
  movieId: string;
  screenId: string;
  cinemaFormatId: string;
  startTime: Date;
  endTime: Date;
  basePrice: number;
  status: ShowStatus;
}




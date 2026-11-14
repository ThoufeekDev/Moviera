import type { ShowStatus } from '../../domain/enums/ShowStatus';

export interface ShowResultDTO {
  id: string;
  movieId: string;
  screenId: string;
  cinemaFormatId: string;
  startTime: Date;
  endTime: Date;
  basePrice: number;
  status: ShowStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

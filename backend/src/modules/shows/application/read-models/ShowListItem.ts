import type { ShowStatus } from '../../domain/enums/ShowStatus';

export interface ShowListItem {
  id: string;
  status: ShowStatus;
  startTime: Date;
  endTime: Date;
  basePrice: number;
  movie: {
    id: string;
    title: string;
    posterUrl: string | null;
    duration: number;
    languages: string[];
    certification: string;
  };
  screen: {
    id: string;
    name: string;
    totalSeats: number;
  };
  theatre: {
    id: string;
    name: string;
    cityName: string;
  };
  cinemaFormat: {
    id: string;
    name: string;
    slug: string;
  };
  seatSummary: {
    totalSeats: number;
    availableSeats: number;
    bookedSeats: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

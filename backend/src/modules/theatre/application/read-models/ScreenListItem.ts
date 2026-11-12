export interface ScreenCinemaFormatItem {
  id: string;
  name: string;
  slug: string;
}

export interface ScreenListItem {
  id: string;
  theatreId: string;
  name: string;
  slug: string;
  isActive: boolean;
  cinemaFormats: ScreenCinemaFormatItem[];
  totalSeats: number;
  totalRows: number;
  totalShows: number;
  seatConfigurationStatus: 'CONFIGURED' | 'NOT_CONFIGURED';
}
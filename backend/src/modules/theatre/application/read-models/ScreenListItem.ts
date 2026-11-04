export interface ScreenListItem {
  id: string;
  theatreId: string;
  name: string;
  slug: string;
  isActive: boolean;
  totalSeats: number;
  totalRows: number;
  totalShows: number;
  seatConfigurationStatus: 'CONFIGURED' | 'NOT_CONFIGURED';
}
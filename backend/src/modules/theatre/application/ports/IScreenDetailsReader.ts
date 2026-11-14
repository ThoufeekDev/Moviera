export interface ScreenDetails {
  id: string;
  theatreId: string;
  isActive: boolean;
  theatreIsActive?: boolean;
  cleaningBufferMinutes?: number;
  cinemaFormatIds?: string[];
}

export interface IScreenDetailsReader {
  findScreenDetailsById(
    screenId: string,
  ): Promise<ScreenDetails | null>;
}
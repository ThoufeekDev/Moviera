export interface ScreenDetails {
  id: string;
  theatreId: string;
  isActive: boolean;
}

export interface IScreenDetailsReader {
  findScreenDetailsById(
    screenId: string,
  ): Promise<ScreenDetails | null>;
}
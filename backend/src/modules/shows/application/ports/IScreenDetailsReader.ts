export interface ScreenDetails {
  id: string;
  theatreId: string;
  isActive: boolean;
}

export interface IScreenDetailsReader {
  findById(screenId: string): Promise<ScreenDetails | null>;
}
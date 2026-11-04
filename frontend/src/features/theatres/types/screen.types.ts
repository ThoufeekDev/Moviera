import type { Paginated } from '@/shared/types/apiResponse';

export type ScreenStatusFilter = 'ALL' | 'ACTIVE' | 'INACTIVE';

export interface ScreenListItem {
  id: string;
  theatreId: string;
  name: string;
  slug: string;
  isActive: boolean;
  totalSeats: number;
  totalShows: number;
}

export interface Screen {
  id: string;
  theatreId: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetScreensParams {
  search?: string;
  status?: ScreenStatusFilter;
  page?: number;
  limit?: number;
}

export type GetScreensResponseData = Paginated<ScreenListItem>;

export interface CreateScreenPayload {
  theatreId: string;
  name: string;
}

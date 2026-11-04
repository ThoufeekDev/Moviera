import type { PaginatedResult } from "../../../../shared/types/Pagination";
import type { ScreenListItem } from "../read-models/ScreenListItem";

export interface ListScreensFilter {
  search?: string;
  status?: 'ALL' | 'ACTIVE' | 'INACTIVE';
  page?: number;
  limit?: number;
}

export interface IScreenQueryService {
  listByTheatre(
    theatreId: string,
    filter?: ListScreensFilter,
  ): Promise<PaginatedResult<ScreenListItem>>;
}

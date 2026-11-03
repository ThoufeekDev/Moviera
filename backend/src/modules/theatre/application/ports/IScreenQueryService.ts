import type { PaginatedResult } from "../../../../shared/types/Pagination";
import type { ScreenListItem } from "../read-models/ScreenListItem";


export interface IScreenQueryService {
  listByTheatre(
    theatreId: string,
    filter?: {
      search?: string;
      status?: 'ALL' | 'ACTIVE' | 'INACTIVE';
      page?: number;
      limit?: number;
    },
  ): Promise<PaginatedResult<ScreenListItem>>;
}
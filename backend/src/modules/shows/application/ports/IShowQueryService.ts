import type { PaginatedResult } from '../../../../shared/types/Pagination';
import type { ShowStatus } from '../../domain/enums/ShowStatus';
import type { ShowDetail } from '../read-models/ShowDetail';
import type { ShowListItem } from '../read-models/ShowListItem';

export type ShowStatusFilter = 'ALL' | ShowStatus;

export interface ListShowsQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: ShowStatusFilter;
  theatreId?: string;
  theatreAdminUserId?: string;
  screenId?: string;
  movieId?: string;
  cinemaFormatId?: string;
  date?: string;
  fromDate?: Date;
  toDate?: Date;
}

export interface IShowQueryService {
  listShows(query: ListShowsQuery): Promise<PaginatedResult<ShowListItem>>;
  findShowDetailById(showId: string): Promise<ShowDetail | null>;
}

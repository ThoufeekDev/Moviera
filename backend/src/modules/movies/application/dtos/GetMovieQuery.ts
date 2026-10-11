import { MovieStatus } from '../query-params/MovieStatus';
import { MovieSortBy } from '../query-params/MovieSortBy';
import { SortOrder } from '../query-params/SortOrder';

export interface GetMoviesQueryDTO {
  page?: number;
  limit?: number;
  search?: string;
  status?: MovieStatus;
  sortBy?: MovieSortBy;
  sortOrder?: SortOrder;
}
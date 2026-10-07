import { MovieStatus } from '../queries/MovieStatus';
import { MovieSortBy } from '../queries/MovieSortBy';
import { SortOrder } from '../queries/SortOrder';

export interface GetMoviesQueryDTO {
  page?: number;
  limit?: number;
  search?: string;
  status?: MovieStatus;
  sortBy?: MovieSortBy;
  sortOrder?: SortOrder;
}
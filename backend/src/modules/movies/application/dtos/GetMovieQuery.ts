import { MovieStatus } from '../../domain/enums/MovieStatus';
import { MovieSortBy } from '../../domain/enums/MovieSortBy';
import { SortOrder } from '../../domain/enums/SortOrder';

export interface GetMoviesQueryDTO {
  page?: number;
  limit?: number;
  search?: string;
  status?: MovieStatus;
  sortBy?: MovieSortBy;
  sortOrder?: SortOrder;
}
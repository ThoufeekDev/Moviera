import { MovieStatus } from '../enums/MovieStatus';
import { MovieSortBy } from '../enums/MovieSortBy';
import { SortOrder } from '../enums/SortOrder';

export interface MovieQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: MovieStatus;
  sortBy?: MovieSortBy;
  sortOrder?: SortOrder;
}
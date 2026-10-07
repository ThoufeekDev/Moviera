import { Certification } from "../../domain/enums/Certification";
import { MovieSortBy } from "./MovieSortBy";
import { SortOrder } from "./SortOrder";

export interface ListMoviesQuery {
  page: number;
  limit: number;
  search?: string;
  genreId?: string;
  languageId?: string;
  certification?: Certification;
  releaseStatus?: 'NOW_SHOWING' | 'UPCOMING'
  sortBy: MovieSortBy;
  sortOrder: SortOrder;
}
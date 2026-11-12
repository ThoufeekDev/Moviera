import { PaginatedResult } from "../../../../shared/types/Pagination";
import { MovieAdminListItem } from "../read-models/MovieAdminListItem";
import { ListMoviesForAdminQuery } from "../query-params/ListMoviesForAdminQuery";
import { MovieAdminDetail } from "../read-models/MovieAdminDetail";
import { MovieSchedulingDetails } from "../read-models/MovieSchedulingDetails";

export interface IMovieQueryService {
    listForAdmin(query: ListMoviesForAdminQuery): Promise<PaginatedResult<MovieAdminListItem>>
    
    findAdminDetailById(id: string): Promise<MovieAdminDetail | null>;

    findAdminDetailBySlug(slug: string): Promise<MovieAdminDetail | null>;
    
    findSchedulingDetailsById(
  id: string,
): Promise<MovieSchedulingDetails | null>;
}
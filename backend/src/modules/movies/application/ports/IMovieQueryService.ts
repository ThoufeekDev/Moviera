import { PaginatedResult } from "../../../../shared/types/Pagination";
import { MovieAdminListItem } from "../read-models/MovieAdminListItem";
import { ListMoviesForAdminQuery } from "../queries/ListMoviesForAdminQuery";
import { MovieAdminDetail } from "../read-models/MovieAdminDetail";





export interface IMovieQueryService {
    listForAdmin(query: ListMoviesForAdminQuery): Promise<PaginatedResult<MovieAdminListItem>>
    
    findAdminDetailById(id: string): Promise<MovieAdminDetail | null>;

    findAdminDetailBySlug(slug: string): Promise<MovieAdminDetail |null>;
}
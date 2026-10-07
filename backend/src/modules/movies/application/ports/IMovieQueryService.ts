import { PaginatedResult } from "../../../../shared/types/Pagination";
import { MovieAdminListItem } from "../read-models/MovieAdminListItem";
import { ListMoviesForAdminQuery } from "../queries/ListMoviesForAdminQuery";





export interface IMovieQueryService {
    listForAdmin(query:ListMoviesForAdminQuery):Promise<PaginatedResult<MovieAdminListItem>>
}
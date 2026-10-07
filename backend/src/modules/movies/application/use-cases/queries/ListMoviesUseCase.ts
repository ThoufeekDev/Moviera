import { PaginatedResult } from "../../../../../shared/types/Pagination";
import { IMovieQueryService } from "../../ports/IMovieQueryService";
import { ListMoviesForAdminQuery } from "../../queries/ListMoviesForAdminQuery";
import { MovieAdminListItem } from "../../read-models/MovieAdminListItem";


export class ListMovieUseCase {
    constructor(private readonly movieQueryService: IMovieQueryService) { };

    async execute(query: ListMoviesForAdminQuery): Promise<PaginatedResult<MovieAdminListItem>> {
        return this.movieQueryService.listForAdmin(query)
    }
}
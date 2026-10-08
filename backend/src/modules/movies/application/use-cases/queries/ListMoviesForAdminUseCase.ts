import { IUseCase } from "../../../../../shared/application/interfaces/IUseCase";
import { NotFoundError } from "../../../../../shared/errors/NotFoundError";
import { PaginatedResult } from "../../../../../shared/types/Pagination";
import { IMovieQueryService } from "../../ports/IMovieQueryService";
import { ListMoviesForAdminQuery } from "../../queries/ListMoviesForAdminQuery";
import { MovieAdminListItem } from "../../read-models/MovieAdminListItem";

interface ListMovieForAdminRequest {
    query: ListMoviesForAdminQuery
}

export class ListMoviesForAdminUseCase implements IUseCase<ListMovieForAdminRequest,PaginatedResult<MovieAdminListItem>> {
    constructor(private readonly movieQueryService: IMovieQueryService) { };

    async execute(request:ListMovieForAdminRequest): Promise<PaginatedResult<MovieAdminListItem>> {
        const movie = this.movieQueryService.listForAdmin(request.query)
        
        if (!movie) throw new NotFoundError("Movie not found")
        
        return movie;
    }
}
import { IUseCase } from "../../../../shared/application/interfaces/IUseCase";
import { PaginatedResult } from "../../../../shared/types/Pagination";
import { IMovieQueryService } from "../ports/IMovieQueryService";
import { ListMoviesForAdminQuery } from "../query-params/ListMoviesForAdminQuery";
import { MovieAdminListItem } from "../read-models/MovieAdminListItem";

interface ListMovieForAdminRequest {
  query: ListMoviesForAdminQuery;
}

export class ListMoviesForAdminUseCase implements IUseCase<ListMovieForAdminRequest, PaginatedResult<MovieAdminListItem>> {
  constructor(private readonly movieQueryService: IMovieQueryService) {}

  async execute(request: ListMovieForAdminRequest): Promise<PaginatedResult<MovieAdminListItem>> {
    const result = await this.movieQueryService.listForAdmin(request.query);
    return result;
  }
}
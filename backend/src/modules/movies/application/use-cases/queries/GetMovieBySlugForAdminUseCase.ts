
import { IMovieQueryService } from "../../ports/IMovieQueryService";
import { IUseCase } from "../../../../../shared/application/interfaces/IUseCase";
import { MovieAdminDetail } from "../../read-models/MovieAdminDetail";
import { NotFoundError } from "../../../../../shared/errors/NotFoundError";

export interface GetMovieBySlugForAdminRequest {
    slug:string
}

export class GetMovieBySlugForAdminUseCase implements IUseCase<GetMovieBySlugForAdminRequest,MovieAdminDetail>{
  constructor(private readonly movieQueryService: IMovieQueryService) { };


      async execute(request: GetMovieBySlugForAdminRequest): Promise<MovieAdminDetail> {
          const movie = await this.movieQueryService.findAdminDetailBySlug(request.slug);

          if (!movie) throw new NotFoundError("Movie not found");

          return movie;
      }
}

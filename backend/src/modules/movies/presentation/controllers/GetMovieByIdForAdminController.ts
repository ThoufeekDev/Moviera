import { ok } from "../../../../shared/http/response";
import { GetMovieByIdForAdminUseCase } from "../../application/queries/GetMovieByIdForAdminUseCase";
import { HttpRequest, HttpResponse } from "../../../../shared/http/HttpTypes";

interface GetMovieByIdForAdminParams {
  id: string;
}

export class GetMovieByIdForAdminController {
  constructor(private readonly getMovieByIdForAdminUseCase: GetMovieByIdForAdminUseCase) {}

  handle = async (req: HttpRequest<GetMovieByIdForAdminParams>): Promise<HttpResponse> => {
    const movie = await this.getMovieByIdForAdminUseCase.execute({ id: req.params.id });
    return ok(movie, "Movie detail fetched successfully");
  };
}
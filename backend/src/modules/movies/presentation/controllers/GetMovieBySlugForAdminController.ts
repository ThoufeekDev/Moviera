import { ok } from "../../../../shared/http/response";
import { HttpRequest, HttpResponse } from "../../../../shared/http/HttpTypes";
import { GetMovieBySlugForAdminUseCase } from "../../application/queries/GetMovieBySlugForAdminUseCase";

interface GetMovieBySlugForAdminParams {
  slug: string;
}

export class GetMovieBySlugForAdminController {
  constructor(private readonly getMovieBySlugByAdmin: GetMovieBySlugForAdminUseCase) {}

  handle = async (req: HttpRequest<GetMovieBySlugForAdminParams>): Promise<HttpResponse> => {
    const movie = await this.getMovieBySlugByAdmin.execute({ slug: req.params.slug });
    return ok(movie, "Movie detail fetched successfully");
  };
}

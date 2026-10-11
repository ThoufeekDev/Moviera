import { HttpRequest, HttpResponse } from "../../../../shared/http/HttpTypes";
import { ok } from "../../../../shared/http/response";
import { GetGenresUseCase } from "../../application/queries/GetGenresUseCase";

export class GetGenreController {
  constructor(private readonly useCase: GetGenresUseCase) {}

  handle = async (_req: HttpRequest): Promise<HttpResponse> => {
    const genres = await this.useCase.execute();
    return ok(genres, "Genres fetched successfully");
  };
}
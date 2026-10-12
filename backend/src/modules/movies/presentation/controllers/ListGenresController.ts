import { HttpRequest, HttpResponse } from "../../../../shared/http/HttpTypes";
import { ok } from "../../../../shared/http/response";
import { ListGenresUseCase } from "../../application/queries/ListGenresUseCase";

export class ListGenresController {
  constructor(private readonly useCase: ListGenresUseCase) {}

  handle = async (_req: HttpRequest): Promise<HttpResponse> => {
    const genres = await this.useCase.execute();
    return ok(genres, "Genres fetched successfully");
  };
}
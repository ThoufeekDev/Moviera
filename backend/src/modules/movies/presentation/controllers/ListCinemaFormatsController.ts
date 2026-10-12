import { HttpRequest, HttpResponse } from "../../../../shared/http/HttpTypes";
import { ok } from "../../../../shared/http/response";
import { ListCinemaFormatsUseCase } from "../../application/queries/ListCinemaFormatsUseCase";

export class ListCinemaFormatsController {
  constructor(private readonly useCase: ListCinemaFormatsUseCase) {}

  handle = async (_req: HttpRequest): Promise<HttpResponse> => {
    const cinemaFormats = await this.useCase.execute();
    return ok(cinemaFormats, "Cinema formats fetched successfully");
  };
}
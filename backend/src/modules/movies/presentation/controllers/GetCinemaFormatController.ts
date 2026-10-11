import { HttpRequest, HttpResponse } from "../../../../shared/http/HttpTypes";
import { ok } from "../../../../shared/http/response";
import { GetCinemaFormatUseCase } from "../../application/queries/GetCinemaFormatUseCase";

export class GetCinemaFormatController {
  constructor(private readonly useCase: GetCinemaFormatUseCase) {}

  handle = async (_req: HttpRequest): Promise<HttpResponse> => {
    const cinemaFormats = await this.useCase.execute();
    return ok(cinemaFormats, "Cinema formats fetched successfully");
  };
}
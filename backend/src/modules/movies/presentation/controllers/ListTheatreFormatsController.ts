import { HttpRequest, HttpResponse } from "../../../../shared/http/HttpTypes";
import { ok } from "../../../../shared/http/response";
import { ListTheatreFormatsUseCase } from "../../application/queries/ListTheatreFormatsUseCase";

export class ListTheatreFormatsController {
  constructor(private readonly useCase: ListTheatreFormatsUseCase) {}

  handle = async (_req: HttpRequest): Promise<HttpResponse> => {
    const theatreFormats = await this.useCase.execute();
    return ok(theatreFormats, "Theatre formats fetched successfully");
  };
}
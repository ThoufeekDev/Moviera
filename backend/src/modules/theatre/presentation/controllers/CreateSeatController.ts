import { HttpRequest, HttpResponse } from "../../../../shared/http/HttpTypes";
import { created } from "../../../../shared/http/response";
import { CreateSeatUseCase } from "../../application/commands/CreateSeatUseCase";
import { CreateSeatDTO } from "../../application/dtos/CreateSeatDTO";

interface CreateSeatParams {
  screenId: string;
}

export class CreateSeatController {
  constructor(private readonly createSeatUseCase: CreateSeatUseCase) {}

  handle = async (
    req: HttpRequest<CreateSeatParams, Omit<CreateSeatDTO, "screenId">>,
  ): Promise<HttpResponse> => {
    const seat = await this.createSeatUseCase.execute({
      ...req.body,
      screenId: req.params.screenId,
    });

    return created(seat, "Seat created successfully");
  };
}

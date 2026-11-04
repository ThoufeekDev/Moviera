import { HttpRequest, HttpResponse } from "../../../../shared/http/HttpTypes";
import { created } from "../../../../shared/http/response";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";
import { CreateScreenUseCase } from "../../application/commands/CreateScreenUseCase";
import type { ScreenResultDTO } from "../../application/dtos/ScreenResultDTO";
import type { CreateScreenInput } from "../schemas/CreateScreenSchema";

export class CreateScreenController {
  constructor(private readonly createScreenUseCase: CreateScreenUseCase) {}

  handle = async (
    req: HttpRequest<unknown, CreateScreenInput>,
  ): Promise<HttpResponse<ScreenResultDTO>> => {
    if (!req.user?.userId) {
      throw new UnauthorizedError("Authentication required");
    }

    const result = await this.createScreenUseCase.execute({
      theatreId: req.body.theatreId,
      name: req.body.name,
      actor: {
        userId: req.user.userId,
        role: req.user.role,
      },
    });

    return created(result, "Screen created successfully.");
  };
}

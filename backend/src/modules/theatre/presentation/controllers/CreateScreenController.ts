import type { Response } from "express";

import { CreateScreenUseCase } from "../../application/use-cases/CreateScreenUseCase";
import { successResponse } from "../../../../shared/utils/apiResponse";
import { AuthenticatedRequest } from "../../../../shared/types/AuthenticateRequest";


interface CreateScreenRequestBody {
  theatreId: string;
  name: string;
}

export class CreateScreenController {
  constructor(
    private readonly createScreenUseCase: CreateScreenUseCase,
  ) {}

  handle = async (
    req: AuthenticatedRequest<
      Record<string, string>,
CreateScreenRequestBody
    >,
    res: Response,
  ): Promise<Response> => {
    const screen = await this.createScreenUseCase.execute({
      theatreId: req.body.theatreId,
      name: req.body.name,
      adminId: req.userId!,
    });

    return successResponse(
      res,
      201,
      true,
      "Screen created successfully",
      screen,
    );
  };
}
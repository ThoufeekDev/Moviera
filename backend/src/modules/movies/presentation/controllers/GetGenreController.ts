import { Request, Response } from "express";
import { GetGenresUseCase } from "../../application/use-cases/GetGenresUseCase";
import { successResponse } from "../../../../shared/utils/apiResponse";

export class GetGenreController {
  constructor(
    private readonly useCase: GetGenresUseCase
  ) {}

  handle = async (req: Request, res: Response) => {
    const genres = await this.useCase.execute();

    successResponse(
      res,
      200,
      true,
      "Genres fetched successfully",
      genres
    );
  };
}
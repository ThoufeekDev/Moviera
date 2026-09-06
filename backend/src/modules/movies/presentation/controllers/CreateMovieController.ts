import { Request, Response } from "express";
import { CreateMovieUseCase } from "../../application/use-cases/CreateMovieUserCase";
import { successResponse } from "../../../../shared/utils/apiResponse";

export class CreateMovieController {
   /**
   *! Constructor Dependency Injection.
   */
  constructor(private readonly createMovieUseCase: CreateMovieUseCase) {}

    
    
    
   handle  = async (req: Request, res: Response)=>{
    const movie = await this.createMovieUseCase.execute(req.body);

    successResponse(res, 201, true, 'Movie created sucessfuly', movie);
  }
}


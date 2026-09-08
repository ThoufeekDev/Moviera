import { Request, Response } from "express";
import { GetMovieByIdUseCase } from "../../application/use-cases/GetMovieByIdUseCase";
import { successResponse } from "../../../../shared/utils/apiResponse";



export class GetMovieByIdController {
    constructor(private readonly getMovieByIdUseCase: GetMovieByIdUseCase) { }
    

    handle = async (req: Request<{id:string}>, res: Response) => {
    
      
        const movie = await this.getMovieByIdUseCase.execute(req.params.id);

        return successResponse(res,200,true,"getMovieById succesful",movie)
    }
}
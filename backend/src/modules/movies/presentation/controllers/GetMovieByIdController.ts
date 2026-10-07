import { Request, Response } from "express";
import { GetMovieByIdUseCase } from "../../application/use-cases/GetMovieByIdUseCase";
import { successResponse } from "../../../../shared/utils/apiResponse";
import { MovieResponseMapper } from "../mappers/MovieResponseMapper";



export class GetMovieByIdController {
    constructor(private readonly getMovieByIdUseCase: GetMovieByIdUseCase) { }
    

    handle = async (req: Request<{id:string}>, res: Response) => {
    
      
        const movie = await this.getMovieByIdUseCase.execute(req.params.id);

        const response = movie?MovieResponseMapper.toResponse(movie):null

        return successResponse(res,200,true,"getMovieById succesful",response)
    }
}
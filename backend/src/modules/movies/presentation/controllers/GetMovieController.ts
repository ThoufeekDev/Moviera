import { Request, Response } from "express";
import { GetMovieUseCase } from "../../application/use-cases/GetMoviesUseCase";
import { successResponse } from "../../../../shared/utils/apiResponse";



export class GetMovieController {
    constructor(private readonly getMovieUseCase: GetMovieUseCase) { };


     handle = async(req:Request,res:Response)=>{
         const allMovies = await this.getMovieUseCase.execute();
         console.log('list all movies',allMovies)

        return successResponse(res,200,true,"All Movie fetch sucesfully",allMovies)
    }
}
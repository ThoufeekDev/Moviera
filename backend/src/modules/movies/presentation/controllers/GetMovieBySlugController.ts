import { successResponse } from "../../../../shared/utils/apiResponse";
import { GetMovieBySlugUseCase } from "../../application/use-cases/GetMovieBySlugUseCase";
import { Request,Response } from "express";
import { MovieResponseMapper } from "../mappers/MovieResponseMapper";



export class GetMovieBySlugController {
    constructor(
       public readonly getMovieBySlugUseCase:GetMovieBySlugUseCase
    ) { };


    handle = async (req:Request<{slug:string}>,res:Response) => {


        const movie = await this.getMovieBySlugUseCase.execute(req.params.slug);

        const response = MovieResponseMapper.toResponse(movie)

     

      return  successResponse(res,200,true,"Movie by slug fetch succesfully...",response)
    } 
}
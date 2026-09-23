import { successResponse } from "../../../../shared/utils/apiResponse";
import { GetMovieBySlugUseCase } from "../../application/use-cases/GetMovieBySlugUseCase";
import { Request,Response } from "express";



export class GetMovieBySlugController {
    constructor(
       public readonly getMovieBySlugUseCase:GetMovieBySlugUseCase
    ) { };


    handle = async (req:Request<{slug:string}>,res:Response) => {


        const result = await this.getMovieBySlugUseCase.execute(req.params.slug);

     

        successResponse(res,200,true,"Movie by slug fetch succesfully...",result)
    } 
}
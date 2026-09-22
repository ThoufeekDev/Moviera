import { successResponse } from "../../../../shared/utils/apiResponse";
import { GetMovieBySlugUseCase } from "../../application/use-cases/GetMovieBySlugController";
import { Request,Response } from "express";



export class GetMovieBySlugController {
    constructor(
       public readonly getMovieBySlugUseCase:GetMovieBySlugUseCase
    ) { };


    handle = async (req:Request<{slug:string}>,res:Response) => {

    console.log("backend slug trigger")
        const result = await this.getMovieBySlugUseCase.execute(req.params.slug);

        console.log('movie by slug is ',result)

        successResponse(res,200,true,"Movie by slug fetch succesfully...",result)
    } 
}
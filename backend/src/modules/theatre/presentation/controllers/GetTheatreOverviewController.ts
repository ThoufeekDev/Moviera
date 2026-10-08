import { AuthenticatedRequest } from "../../../../shared/types/AuthenticateRequest";
import { successResponse } from "../../../../shared/utils/apiResponse";
import { GetTheatreOverviewUseCase } from "../../application/use-cases/GetTheatreOverviewUseCase";
import { Response } from "express";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";
import { TheatreResponseMapper } from "../mappers/TheatreResponseMapper";

export interface TheatreParams{
    theatreId:string
}

export class GetTheatreOverviewcontroller {

    constructor(private readonly getTheatreOverviewController: GetTheatreOverviewUseCase) { }
    
    handle = async (req:AuthenticatedRequest<{theatreId:string}>,res:Response) => {
             if (!req.userId) {
        throw new UnauthorizedError("Authentication required");
    }
        const overview = await this.getTheatreOverviewController.execute(
            req.params.theatreId,
            req.userId
        )


        const data = {
            ...overview,
            theatre: TheatreResponseMapper.toResponse(
                overview.theatre.theatre,
                overview.theatre.city
            )
        }
        
        successResponse(res,200,true,"Theatre overview retrieved succesfully",data)
    }
}
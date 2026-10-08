import { successResponse } from "../../../../shared/utils/apiResponse";
import { Request, Response } from "express";
import { GetMyTheatresUseCase } from "../../application/use-cases/GetMyTheatresUseCase";
import { AuthenticatedRequest } from "../../../../shared/types/AuthenticateRequest";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";
import { TheatreResponseMapper } from "../mappers/TheatreResponseMapper";

export class GetMyTheatresController {
    constructor(
        private readonly getMyTheatresUseCase:GetMyTheatresUseCase
    ) { }
    

    handle = async (req: AuthenticatedRequest, res: Response) => {
        if (!req.userId) throw new UnauthorizedError('Authentication required');
        console.log('trigger');
        
        const theatres = await this.getMyTheatresUseCase.execute(req.userId)
        
        const data =   TheatreResponseMapper.toResponseList(theatres)
        
        console.log('after converting',data)
        
        successResponse(res,200,true,'Theatres retrieved succesfully',data)
    }
}
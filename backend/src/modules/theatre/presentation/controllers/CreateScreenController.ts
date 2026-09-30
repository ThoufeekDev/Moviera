import type { Request, Response } from "express";

import { CreateScreenUseCase } from "../../application/use-cases/CreateScreenUseCase";
import { successResponse } from "../../../../shared/utils/apiResponse";



export class CreateScreenController {
    constructor(
        private readonly createScreenUseCase:CreateScreenUseCase,
    ) { }
    
    handle = async(req:Request,res:Response):Promise<Response>=>{
        const screen = await this.createScreenUseCase.execute(req.body);

        return successResponse(res,201,true,"Screen created successfully",screen)
    }
}
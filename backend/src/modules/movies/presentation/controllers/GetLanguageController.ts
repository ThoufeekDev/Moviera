import { Request, Response } from "express";
import { GetLanugageUseCase } from "../../application/use-cases/GetLanugageUseCase";
import { successResponse } from "../../../../shared/utils/apiResponse";



export class GetLanguageController{
    constructor(private readonly useCase: GetLanugageUseCase) { };

   handle = async(req: Request, res: Response)=>{
        const languages = await this.useCase.execute();

        successResponse(res, 200, true, "Lanugae fetched succesfully",languages);
    }
}
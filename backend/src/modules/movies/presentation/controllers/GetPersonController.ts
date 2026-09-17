import { Request, Response } from "express";
import { GetPersonsUseCase } from "../../application/use-cases/GetPersonUseCase";
import { successResponse } from "../../../../shared/utils/apiResponse";

export class GetPersonController {
    constructor(private readonly useCase: GetPersonsUseCase) { };


    handle = async (req:Request,res:Response) => {
        const person = await this.useCase.execute();

        successResponse(res,200,true,"Person fetched succesfully",person)
    }
}
import { Request,Response } from "express";
import { GetCinemaFormatUseCase } from "../../application/use-cases/GetCinemaFormatUseCase";
import { successResponse } from "../../../../shared/utils/apiResponse";


export class GetCinemaFormatController {
    constructor(private readonly useCase: GetCinemaFormatUseCase) { };

    handle = async (req: Request, res: Response) => {
        const cinemaFormats = await this.useCase.execute();

        successResponse(res,200,true,"Cinema formats fetched succesfully",cinemaFormats)
    }
}
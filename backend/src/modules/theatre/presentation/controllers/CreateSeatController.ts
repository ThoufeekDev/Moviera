import { Request , Response} from 'express';
import { CreateSeatUseCase } from "../../application/use-cases/CreateSeatUseCase";
import { successResponse } from '../../../../shared/utils/apiResponse';



export class CreateSeatController {
    constructor(
        private readonly createSeatUseCase: CreateSeatUseCase
    ) { }
    

    handle = async (req: Request, res: Response) => {
       
        const seat = await this.createSeatUseCase.execute({
            screenId: req.params.screenId,
            ...req.body
        });

        successResponse(
            res,
            201,
            true,
            'Seat created succesfully',
            seat
        )
    }
}


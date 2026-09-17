import { Request, Response } from 'express';
import { GetPersonByIdUseCase } from '../../application/use-cases/GetPersonByIdUseCase';
import { successResponse } from '../../../../shared/utils/apiResponse';
export class GetPersonByIdController {
  constructor(private readonly getPersonByIdUseCase: GetPersonByIdUseCase) {}

     handle =  async(req: Request<{ id: string }>, res: Response)=> {
    const { id } = req.params;

    const person = await this.getPersonByIdUseCase.execute(id);

    // return res.status(200).json({
    //   message: 'Person fetched successfully',
    //   data: person,
         // });

         console.log('person by id ',person);
         
         
         successResponse(res, 200, true, 'Person fetched successfully',person);
  }
}

import { Request, Response } from "express";
import { CreatePersonUseCase } from "../../application/use-cases/CreatePersonUseCase";
import { successResponse } from "../../../../shared/utils/apiResponse";


export class CreatePersonController {
    constructor(
        private readonly createPersonUseCase: CreatePersonUseCase,
    ) { }
    
    handle = async (req:Request,res:Response) => {
        const { name } = req.body;

        const file = req.file;

   

        // let imageUrl: string | undefined;

        // if (file) {
        //     const image = await this.cloudinaryService.uploadImage(
        //         file.buffer,
        //         'moviera/people'
        //     )
        //     imageUrl = image.secureUrl;
        // }

        const person = await this.createPersonUseCase.execute({name,imageFile:file?{buffer:file.buffer}:undefined});

        successResponse(res,201,true,"Person created successsfuly",person)
    }
}
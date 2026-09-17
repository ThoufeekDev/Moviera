import { Request, Response } from "express";
import { CreatePersonUseCase } from "../../application/use-cases/CreatePersonUseCase";
import { successResponse } from "../../../../shared/utils/apiResponse";
import { CloudinaryService } from "../../../../shared/services/cloudinary.service";

export class CreatePersonController {
    constructor(
        private readonly createPersonUseCase: CreatePersonUseCase,
        private readonly cloudinaryService:CloudinaryService
    ) { }
    
    handle = async (req:Request,res:Response) => {
        const { name } = req.body;

        const file = req.file;

        let imageUrl: string | undefined;

        if (file) {
            const image = await this.cloudinaryService.uploadImage(
                file.buffer,
                'moviera/people'
            )
            imageUrl = image.secureUrl;
        }

        const person = await this.createPersonUseCase.execute({name,imageUrl});

        successResponse(res,201,true,"Person created successsfuly",person)
    }
}
import { Request, Response } from 'express';
import { CreateMovieUseCase } from '../../application/use-cases/CreateMovieUseCase';
import { successResponse } from '../../../../shared/utils/apiResponse';


export class CreateMovieController {
  constructor(
    private readonly createMovieUseCase: CreateMovieUseCase,
  ) {}

  handle = async (req: Request, res: Response) => {
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };
    
    console.log("BODY:", req.body);

    const posterFile = files?.poster?.[0];
    const backdropFile = files?.backdrop?.[0];



    const movie = await this.createMovieUseCase.execute({
      ...req.body,

      // multer change the type to string  
      duration: Number(req.body.duration),

      releaseDate: new Date(req.body.releaseDate),
      posterFile:posterFile?{buffer:posterFile.buffer}:undefined,
      backdropFile:backdropFile?{buffer:backdropFile.buffer}:undefined
    });


    successResponse(res, 201, true, 'Movie created successfully', movie);
  };
}

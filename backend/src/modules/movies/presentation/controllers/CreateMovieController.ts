import { Request, Response } from 'express';
import { CreateMovieUseCase } from '../../application/use-cases/CreateMovieUseCase';
import { successResponse } from '../../../../shared/utils/apiResponse';
import { CloudinaryService } from '../../../../shared/services/cloudinary.service';

export class CreateMovieController {
  constructor(
    private readonly createMovieUseCase: CreateMovieUseCase,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  handle = async (req: Request, res: Response) => {
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const posterFile = files?.poster?.[0];
    const backdropFile = files?.backdrop?.[0];

    let posterUrl: string | undefined;
    let backdropUrl: string | undefined;

    if (posterFile) {
      posterUrl = await this.cloudinaryService.uploadImage(
        posterFile.buffer,
        'moviera/movies/posters',
      );
    }

    if (backdropFile) {
      backdropUrl = await this.cloudinaryService.uploadImage(
        backdropFile.buffer,
        'moviera/movies/backdrops',
      );
    }

    const movie = await this.createMovieUseCase.execute({
      ...req.body,

      // multer change the type to string  
      duration: Number(req.body.duration),

      releaseDate: new Date(req.body.releaseDate),
      posterUrl,
      backdropUrl,
    });

    successResponse(res, 201, true, 'Movie created successfully', movie);
  };
}

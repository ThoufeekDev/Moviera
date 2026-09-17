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
    
    console.log("BODY:", req.body);
console.log("FILES:", req.files);
    const posterFile = files?.poster?.[0];
    const backdropFile = files?.backdrop?.[0];

    let posterUrl: string | undefined;
    let posterPublicId: string | undefined;

    let backdropUrl: string | undefined;
    let backdropPublicId: string | undefined;
    if (posterFile) {
     const poster = await this.cloudinaryService.uploadImage(
        posterFile.buffer,
        'moviera/movies/posters',
     );
      posterUrl = poster.secureUrl;
      posterPublicId = poster.publicId;
    }

    if (backdropFile) {
      const backdrop = await this.cloudinaryService.uploadImage(
        backdropFile.buffer,
        'moviera/movies/backdrops',
      );

        backdropUrl = backdrop.secureUrl;
        backdropPublicId = backdrop.publicId;
    }

    const movie = await this.createMovieUseCase.execute({
      ...req.body,

      // multer change the type to string  
      duration: Number(req.body.duration),

      releaseDate: new Date(req.body.releaseDate),
      posterUrl,
      posterPublicId,
      backdropUrl,
      backdropPublicId
    });

    successResponse(res, 201, true, 'Movie created successfully', movie);
  };
}

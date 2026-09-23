import { Request, Response } from 'express';
import { UpdateMovieUseCase } from '../../application/use-cases/UpdateMovieUseCase';
import { successResponse } from '../../../../shared/utils/apiResponse';

export class UpdateMovieController {
  constructor(
    private readonly updateMovieUseCase: UpdateMovieUseCase,
  ) {}

  handle = async (req: Request<{ id: string }>, res: Response) => {
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const posterFile = files?.poster?.[0];
    const backdropFile = files?.backdrop?.[0];

   

      const movieToUpdate = {
        ...req.body,

        duration: req.body.duration
          ? Number(req.body.duration)
          : undefined,

        releaseDate: req.body.releaseDate
          ? new Date(req.body.releaseDate)
          : undefined,

              posterFile: posterFile
        ? { buffer: posterFile.buffer }
        : undefined,

      backdropFile: backdropFile
        ? { buffer: backdropFile.buffer }
        : undefined,
      };

     const updatedMovie = await this.updateMovieUseCase.execute(
        req.params.id,
        movieToUpdate,
      );
  
      // New images were uploaded but movie update failed.
      // Remove them to avoid orphaned Cloudinary assets.

    // Old images are no longer needed after successful DB update.
    // Do not make the user wait for Cloudinary deletion.

    successResponse(
      res,
      200,
      true,
      'Movie successfully updated',
      updatedMovie.movie,
    );
  };
}
import { Request, Response } from 'express';
import { UpdateMovieUseCase } from '../../application/use-cases/UpdateMovieUseCase';
import { successResponse } from '../../../../shared/utils/apiResponse';
import { CloudinaryService } from '../../../../shared/services/cloudinary.service';
import { UpdateMovieResult } from '../../domain/types/UpdateMovieResult';

export class UpdateMovieController {
  constructor(
    private readonly updateMovieUseCase: UpdateMovieUseCase,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  handle = async (req: Request<{ id: string }>, res: Response) => {
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const posterFile = files?.poster?.[0];
    const backdropFile = files?.backdrop?.[0];

    let posterPublicId: string | undefined;
    let backdropPublicId: string | undefined;

    let updatedMovie: UpdateMovieResult;

    try {
      // Upload images concurrently
      const [poster, backdrop] = await Promise.all([
        posterFile
          ? this.cloudinaryService.uploadImage(
              posterFile.buffer,
              'moviera/movies/posters',
            )
          : null,

        backdropFile
          ? this.cloudinaryService.uploadImage(
              backdropFile.buffer,
              'moviera/movies/backdrops',
            )
          : null,
      ]);

      posterPublicId = poster?.publicId;
      backdropPublicId = backdrop?.publicId;

      const movieToUpdate = {
        ...req.body,

        duration: req.body.duration
          ? Number(req.body.duration)
          : undefined,

        releaseDate: req.body.releaseDate
          ? new Date(req.body.releaseDate)
          : undefined,

        ...(poster && {
          posterUrl: poster.secureUrl,
          posterPublicId: poster.publicId,
        }),

        ...(backdrop && {
          backdropUrl: backdrop.secureUrl,
          backdropPublicId: backdrop.publicId,
        }),
      };

      updatedMovie = await this.updateMovieUseCase.execute(
        req.params.id,
        movieToUpdate,
      );
    } catch (error) {
      // New images were uploaded but movie update failed.
      // Remove them to avoid orphaned Cloudinary assets.
      if (posterPublicId) {
        await this.cloudinaryService.deleteImage(posterPublicId);
      }

      if (backdropPublicId) {
        await this.cloudinaryService.deleteImage(backdropPublicId);
      }

      throw error;
    }

    // Old images are no longer needed after successful DB update.
    // Do not make the user wait for Cloudinary deletion.
    if (updatedMovie.oldPosterPublicId) {
      this.cloudinaryService
        .deleteImage(updatedMovie.oldPosterPublicId)
        .catch((error) => {
          console.error(
            'Failed to delete old poster from Cloudinary:',
            error,
          );
        });
    }

    if (updatedMovie.oldBackdropPublicId) {
      this.cloudinaryService
        .deleteImage(updatedMovie.oldBackdropPublicId)
        .catch((error) => {
          console.error(
            'Failed to delete old backdrop from Cloudinary:',
            error,
          );
        });
    }

    successResponse(
      res,
      200,
      true,
      'Movie successfully updated',
      updatedMovie.movie,
    );
  };
}
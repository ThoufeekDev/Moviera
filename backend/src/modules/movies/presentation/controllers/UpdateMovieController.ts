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

    let posterUrl: string | undefined;
    let posterPublicId: string | undefined;
    let backdropUrl: string | undefined;
    let backdropPublicId: string | undefined;

    let updatedMovie: UpdateMovieResult;

    try {
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
      const movieToUpdate = {
        ...req.body,
        duration: req.body.duration ? Number(req.body.duration) : undefined,
        releaseDate: req.body.releaseDate ? new Date(req.body.releaseDate) : undefined,
        ...(posterFile && {
          posterUrl,
          posterPublicId,
        }),

        ...(backdropFile && {
          backdropUrl,
          backdropPublicId,
        }),
      };
      updatedMovie = await this.updateMovieUseCase.execute(req.params.id, movieToUpdate);
    } catch (error) {
      if (posterPublicId) {
        await this.cloudinaryService.deleteImage(posterPublicId);
      }

      if (backdropPublicId) {
        await this.cloudinaryService.deleteImage(backdropPublicId);
      }

      throw error;
    }

    try {
      if (updatedMovie.oldPosterPublicId) {
        await this.cloudinaryService.deleteImage(updatedMovie.oldPosterPublicId);
      }

      if (updatedMovie.oldBackdropPublicId) {
        await this.cloudinaryService.deleteImage(updatedMovie.oldBackdropPublicId);
      }
    } catch (error) {
      console.error('Failed to delete old movie images from Cloudinary:', error);
    }

    successResponse(res, 200, true, 'Movie successfully updated', updatedMovie.movie);
  };
}

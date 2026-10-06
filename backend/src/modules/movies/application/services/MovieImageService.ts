import { IStorageService } from '../../../../shared/domain/services/IStorageService';
import { Movie } from '../../domain/entities/Movie';
import { UpdateMovieData } from '../../domain/types/UpdateMovieData';

interface MovieImage {
  secureUrl: string;
  publicId: string;
}

interface MovieImages {
  poster: MovieImage | null;
  backdrop: MovieImage | null;
}

interface MovieImageInput {
  posterFile?: {
    buffer: Buffer;
  };
  backdropFile?: {
    buffer: Buffer;
  };
}

export class MovieImageService {
  constructor(
    private readonly storageService: IStorageService,
  ) {}

  async uploadImages(
    movie: MovieImageInput,
  ): Promise<MovieImages> {
    const results = await Promise.allSettled([
      movie.posterFile
        ? this.storageService.uploadImage(
            movie.posterFile.buffer,
            'moviera/movies/posters',
          )
        : Promise.resolve(null),

      movie.backdropFile
        ? this.storageService.uploadImage(
            movie.backdropFile.buffer,
            'moviera/movies/backdrops',
          )
        : Promise.resolve(null),
    ]);

    const posterResult = results[0];
    const backdropResult = results[1];

    const poster =
      posterResult.status === 'fulfilled'
        ? posterResult.value
        : null;

    const backdrop =
      backdropResult.status === 'fulfilled'
        ? backdropResult.value
        : null;

    if (
      posterResult.status === 'rejected' ||
      backdropResult.status === 'rejected'
    ) {
      await this.rollbackUploads({
        poster,
        backdrop,
      });

      if (posterResult.status === 'rejected') {
        throw posterResult.reason;
      }

      if (backdropResult.status === 'rejected') {
        throw backdropResult.reason;
      }
    }

    return {
      poster,
      backdrop,
    };
  }

  applyImageUpdates(
    updateData: UpdateMovieData,
    images: MovieImages,
  ): void {
    if (images.poster) {
      updateData.posterUrl = images.poster.secureUrl;
      updateData.posterPublicId = images.poster.publicId;
    }

    if (images.backdrop) {
      updateData.backdropUrl = images.backdrop.secureUrl;
      updateData.backdropPublicId = images.backdrop.publicId;
    }
  }

  async cleanupOldImages(
    existingMovie: Movie,
    images: MovieImages,
  ): Promise<void> {
    const deletions: Promise<void>[] = [];

    if (
      images.poster &&
      existingMovie.posterPublicId &&
      existingMovie.posterPublicId !== images.poster.publicId
    ) {
      deletions.push(
        this.deleteSafely(existingMovie.posterPublicId),
      );
    }

    if (
      images.backdrop &&
      existingMovie.backdropPublicId &&
      existingMovie.backdropPublicId !== images.backdrop.publicId
    ) {
      deletions.push(
        this.deleteSafely(existingMovie.backdropPublicId),
      );
    }

    await Promise.all(deletions);
  }

  async rollbackUploads(
    images: MovieImages,
  ): Promise<void> {
    const deletions: Promise<void>[] = [];

    if (images.poster?.publicId) {
      deletions.push(
        this.storageService.deleteImage(
          images.poster.publicId,
        ),
      );
    }

    if (images.backdrop?.publicId) {
      deletions.push(
        this.storageService.deleteImage(
          images.backdrop.publicId,
        ),
      );
    }

    await Promise.all(deletions);
  }

  private async deleteSafely(
    publicId: string,
  ): Promise<void> {
    try {
      await this.storageService.deleteImage(publicId);
    } catch (error) {
      console.error(
        `Failed to delete old movie image: ${publicId}`,
        error,
      );
    }
  }
}
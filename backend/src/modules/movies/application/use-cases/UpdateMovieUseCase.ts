import { IMovieRepository } from '../../domain/repository/IMovieRepository';
import { UpdateMovieDTO } from '../dtos/updateMovieDTO';
import { Movie } from '../../domain/entities/Movie';
import { NotFoundError } from '../../../../shared/exceptions/NotFoundError';
import { generateSlug } from '../../../../shared/utils/generateSlug';
import { ConflictError } from '../../../../shared/exceptions/ConflictError';
import { UpdateMovieData } from '../../domain/types/UpdateMovieData';
import { IGenreRepository } from '../../domain/repository/IGenreRepository';
import { AppError } from '../../../../shared/exceptions/AppError';
import { ILanguageRepository } from '../../domain/repository/ILanguageRepository';
import { IPersonRepository } from '../../domain/repository/IPersonRepository';
import { ICinemaFormatRepository } from '../../domain/repository/ICinemaFormatRepository';

import { UpdateMovieResult } from '../../domain/types/UpdateMovieResult';

import { IStorageService } from '../../../../shared/domain/services/IStorageService';

export class UpdateMovieUseCase {
  constructor(
    private readonly movieRepository: IMovieRepository,
    private readonly genreRepository: IGenreRepository,
    private readonly languageRepository: ILanguageRepository,
    private readonly cinemaFormatRepository: ICinemaFormatRepository,
    private readonly personRepository: IPersonRepository,
    private readonly storageService: IStorageService,
  ) {}

  async execute(id: string, movie: UpdateMovieDTO): Promise<UpdateMovieResult> {
    const { posterFile, backdropFile, ...movieData } = movie;
    const existingMovie = await this.movieRepository.findById(id);

    if (!existingMovie) throw new NotFoundError('Movie not found');

    const updateData: UpdateMovieData = {
      ...movieData,
    };

    // * check if primaryGenreId was provided

    if (movie.primaryGenreId) {
      const genre = await this.genreRepository.findById(movie.primaryGenreId);
      if (!genre) throw new AppError('Invalid or inactive genre', 400);
    }

    // * check if languageIds was provided

    if (movie.languageIds) {
      const languages = await this.languageRepository.findByIds(movie.languageIds);

      if (languages.length !== movie.languageIds.length)
        throw new AppError('One Or more languages are invalid or inactive', 400);
    }

    // * check if cinemaFormats was provided

    if (movie.cinemaFormatIds) {
      const cinemaFormats = await this.cinemaFormatRepository.findByIds(movie.cinemaFormatIds);

      if (cinemaFormats.length !== movie.cinemaFormatIds.length) {
        throw new AppError('One or more cinema formats are invalid or inactive', 400);
      }
    }

    /**
     *
     *   !the movie.cast is actually like an array of infos
     *  ? it contains cast = {[id:"sdhsdl",personId:"fsdfsds",role:"director"]}
     */

    // ! code commented this code is has a problem what if there is 10 crew and 15 members
    // ! on every loop it hits the db
    // if (movie.cast) {
    //   for (const castMember of movie.cast) {
    //     const person = await this.personRepository.findById(
    //       castMember.personId
    //     );

    //     if (!person) {
    //       throw new AppError(
    //         `Person not found: ${castMember.personId}`,
    //         400
    //       );
    //     }
    //   }
    // }

    // if (movie.crew) {
    //   for (const crewMember of movie.crew) {
    //     const person = await this.personRepository.findById(
    //       crewMember.personId
    //     );

    //     if (!person) {
    //       throw new AppError(
    //         `Person not found: ${crewMember.personId}`,
    //         400
    //       );
    //     }
    //   }
    // }

    // ^ The better soluction is pass those in ids in array

    if (movie.crew || movie.cast) {
      const personIds = [
        ...(movie.cast?.map((item) => item.personId) ?? []),
        ...(movie.crew?.map((item) => item.personId) ?? []),
      ];

      const persons = await this.personRepository.findByIds(personIds);
      // ^The Set is useful because the same person could theoretically
      // ^appear in both cast and crew. We don't want duplicates to make
      // ^ our count comparison incorrect.

      if (persons?.length !== new Set(personIds).size) {
        throw new AppError('one or more cast or crew persons are invalid', 400);
      }
    }
    // let slug = existingMovie.slug;

    // Only generate a new slug when title changes

    if (movie.title && movie.title !== existingMovie.title) {
      const slug = generateSlug(movie.title);

      // checking whether another movie already uses the slug

      const movieWithSlug = await this.movieRepository.findBySlug(slug);

      if (movieWithSlug && movieWithSlug.slug !== existingMovie.slug)
        throw new ConflictError('Movie already exists');

      updateData.slug = slug;
    }

    const [poster, backdrop] = await Promise.all([
      movie.posterFile
        ? this.storageService.uploadImage(movie.posterFile.buffer, 'moviera/movies/posters')
        : null,

      movie.backdropFile
        ? this.storageService.uploadImage(movie.backdropFile.buffer, 'moviera/movies/backdrops')
        : null,
    ]);

    if (poster) {
      updateData.posterUrl = poster.secureUrl;
      updateData.posterPublicId = poster.publicId;
    }

    if (backdrop) {
      updateData.backdropUrl = backdrop.secureUrl;
      updateData.backdropPublicId = backdrop.publicId;
    }

    // ?? nullish coalescing Operator

    // we hear use nullish operator
    // why we use nullish operation  if the left is not null use that
    //                               if the left is null then use the right side
    try {
      const updatedMovie = await this.movieRepository.updateMovie(id, updateData);
      


      if (
        poster &&
        existingMovie.posterPublicId
        && existingMovie.posterPublicId !== poster.publicId
      ) {
        this.storageService.deleteImage(existingMovie.posterPublicId)
          .catch((error) => {
          console.error('Failed to delete old poster',error)
        })
      }

         if (
        backdrop &&
        existingMovie.backdropPublicId &&
        existingMovie.backdropPublicId !== backdrop.publicId
      ) {
        this.storageService
          .deleteImage(existingMovie.backdropPublicId)
          .catch((error) => {
            console.error(
              "Failed to delete old backdrop:",
              error,
            );
          });
      }
      return {
        movie: updatedMovie,
      };
    } catch (error) {
            /*
       ! DB update failed after new images were uploaded.
       ! Remove the newly uploaded assets to avoid orphaned
       ! Cloudinary files.
       */
      if (poster?.publicId) {
        await this.storageService.deleteImage(poster.publicId);
      }

      if (backdrop?.publicId) {
        await this.storageService.deleteImage(backdrop.publicId);
      }

      throw error;
    }
  }
}

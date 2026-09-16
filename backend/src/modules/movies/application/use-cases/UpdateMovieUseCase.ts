import { IMovieRepository } from '../../domain/repository/IMovieRepository';
import { UpdateMovieDTO } from '../dtos/updateMovieDTO';
import { Movie } from '../../domain/entities/Movie';
import { NotFoundError } from '../../../../shared/exceptions/NotFoundError';
import { generateSlug } from '../../../../shared/utils/generateSlug';
import { ConflictError } from '../../../../shared/exceptions/ConflictError';
import { UpdateMovieData } from '../../domain/types/UpdateMovieData';
export class UpdateMovieUseCase {
  constructor(private readonly movieRepository: IMovieRepository) {}

    async execute(id: string, movie: UpdateMovieDTO): Promise<Movie> {
      const existingMovie = await this.movieRepository.findById(id);

      if (!existingMovie) throw new NotFoundError('Movie not found');

      const updateData:UpdateMovieData = {
         ...movie
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

      // ?? nullish coalescing Operator

      // we hear use nullish operator
      // why we use nullish operation  if the left is not null use that
      //                               if the left is null then use the right side

      // const { languages, cast, crew, ...movieData } = movie;
      // if (Object.keys(movieData).length > 0) {
      //   movieData.slug = slug;
      // }
      // const updatedData: Partial<Movie> = {
      //   ...movieData,
      //   slug,
      // };

      return this.movieRepository.updateMovie(id, updateData);
      

      //  const updatedData: Partial<Movie> = {
      //    title: movie.title ?? existingMovie.title,
      //    slug,
      //    description: movie.description ?? existingMovie.description,
      //    duration: movie.duration ?? existingMovie.duration,
      //    releaseDate: movie.releaseDate ?? existingMovie.releaseDate,
      //   //  language: movie.language ?? existingMovie.language,
      //    genre: movie.genre ?? existingMovie.genre,
      //    certificate: movie.certificate ?? existingMovie.certificate,
      //    posterUrl: movie.posterUrl ?? existingMovie.posterUrl,
      //    backdropUrl: movie.backdropUrl ?? existingMovie.backdropUrl,
      //    trailerUrl: movie.trailerUrl ?? existingMovie.trailerUrl,
      //    isActive: movie.isActive ?? existingMovie.isActive,
      //  };

      // return this.movieRepository.updateMovie(id, updatedData);
    }


}

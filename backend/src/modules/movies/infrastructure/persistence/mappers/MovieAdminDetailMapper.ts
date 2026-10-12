import { Certification } from '../../../domain/enums/Certification';
import { Prisma } from '@prisma/client';
import { MovieAdminDetail } from '../../../application/read-models/MovieAdminDetail';
import { movieAdminDetailSelect } from '../selects/movieAdminDetailSelect';

type MovieDetailRow = Prisma.MovieGetPayload<{ select: typeof movieAdminDetailSelect }>;

export class MovieAdminDetailMapper {
  static toDetail(movie: MovieDetailRow): MovieAdminDetail {
    return {
      id: movie.id,
      title: movie.title,
      slug: movie.slug,
      posterUrl: movie.posterUrl,
      backdropUrl: movie.backdropUrl,
      certification: Certification[movie.certification],
      description: movie.description,
      releaseDate: movie.releaseDate,
      duration: movie.duration,
      trailerUrl: movie.trailerUrl,
      isActive: movie.isActive,

      primaryGenre: {
        id: movie.primaryGenre.id,
        name: movie.primaryGenre.name,
      },

      genres: movie.genres.map(({ genre }) => genre),

      languages: movie.languages.map(({ language }) => language),

      cinemaFormats: movie.cinemaFormats.map(({ cinemaFormat }) => cinemaFormat),

      cast: movie.cast.map((cast) => ({
        id: cast.id,
        personId: cast.personId,
        name: cast.person.name,
        character: cast.character,
        profileImageUrl: cast.person.imageUrl,
      })),

      crew: movie.crew.map((crew) => ({
        id: crew.id,
        personId: crew.personId,
        name: crew.person.name,
        job: crew.job,
        profileImageUrl: crew.person.imageUrl,
      })),
    };
  }
}

import { MovieAdminListItem } from '../../../application/read-models/MovieAdminListItem';
import { Certification } from '../../../domain/enums/Certification';
import { Prisma } from '@prisma/client';
import { movieAdminListSelect } from '../selects/movieListSelector';

type MovieAdminListRow = Prisma.MovieGetPayload<{select:typeof movieAdminListSelect}>
export class MovieAdminListItemMapper {
  static toAdminItem(movie: MovieAdminListRow): MovieAdminListItem {
    return {
      id: movie.id,
      title: movie.title,
      posterUrl: movie.posterUrl,
      releaseDate: movie.releaseDate,
      certification: Certification[movie.certification],
      isActive: movie.isActive,
      slug: movie.slug,
      primaryGenre: movie.primaryGenre,
      languages: movie.languages.map(({ language }) => language),
      cinemaFormats: movie.cinemaFormats.map(({ cinemaFormat }) => cinemaFormat),
    };
  }
}

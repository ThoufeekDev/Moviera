import { Prisma } from '@prisma/client';
import { Movie } from '../../../domain/entities/Movie';
import { LanguageMapper } from './LanguageMapper';
import { GenreMapper } from './GenreMapper';
import { CinemaFormatMapper } from './CinemaFormatMapper';
import { CastMember } from '../../../domain/value-objects/CastMember';
import { CrewMember } from '../../../domain/value-objects/CrewMember';
import { Certification } from '../../../domain/enums/Certification';
import { ImageRef } from '../../../domain/value-objects/ImageRef';

type MovieWithRelations = Prisma.MovieGetPayload<{
  include: {
    primaryGenre: true;
    genres: {
      include: {
        genre: true;
      };
    };
    languages: {
      include: {
        language: true;
      };
    };
    cinemaFormats: {
      include: {
        cinemaFormat: true;
      };
    };
    cast: {
      include: {
        person: true;
      };
    };
    crew: {
      include: {
        person: true;
      };
    };
  };
}>;

export class MovieMapper {
  static toDomain(movie: MovieWithRelations): Movie {
    const languages = movie.languages.map((movieLanguage) =>
      LanguageMapper.toDomain(movieLanguage.language),
    );

    const primaryGenre = GenreMapper.toDomain(movie.primaryGenre);

    const genres = movie.genres.map((movieGenre) =>
      GenreMapper.toDomain(movieGenre.genre),
    );

    const cinemaFormats = movie.cinemaFormats.map((movieCinemaFormat) =>
      CinemaFormatMapper.toDomain(movieCinemaFormat.cinemaFormat),
    );

    const cast = movie.cast.map((movieCast) =>
      CastMember.create({
        personId: movieCast.personId,
        character: movieCast.character,
      }),
    );

    const crew = movie.crew.map((movieCrew) =>
      CrewMember.create({
        personId: movieCrew.personId,
        job: movieCrew.job,
      }),
    );

    const poster =
      movie.posterUrl && movie.posterPublicId
        ? ImageRef.create({
            url: movie.posterUrl,
            publicId: movie.posterPublicId,
          })
        : null;

    const backdrop =
      movie.backdropUrl && movie.backdropPublicId
        ? ImageRef.create({
            url: movie.backdropUrl,
            publicId: movie.backdropPublicId,
          })
        : null;

    return new Movie(
      movie.id,
      movie.title,
      movie.slug,
      movie.description,
      movie.duration,
      movie.releaseDate,
      languages,
      primaryGenre,
      genres,
      Certification[movie.certification],
      cinemaFormats,
      poster,
      backdrop,
      movie.trailerUrl,
      movie.isActive,
      cast,
      crew,
    );
  }
}

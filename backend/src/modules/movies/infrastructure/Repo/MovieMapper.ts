import { Prisma } from "@prisma/client";
import { Movie } from "../../domain/entities/Movie";
import { Language } from "../../domain/entities/Language";
import { MovieCast } from "../../domain/entities/MovieCast";
import { MovieCrew } from "../../domain/entities/MovieCrew";
import { Person } from "../../domain/entities/Person";
import { CinemaFormat } from '../../domain/entities/CinemaFormat';
import { Genre } from "../../domain/entities/Genre";
import { Certification } from "../../../../shared/enums/Certification";
type MovieWithRelations = Prisma.MovieGetPayload<{
  include: {
    primaryGenre: true,
    languages: {
      include: {
        language: true,
      },
    },
    cinemaFormats: {
      include: {
        cinemaFormat: true,
      },
    },
    cast: {
      include: {
        person: true,
      },
    },
    crew: {
      include: {
        person: true,
      },
    },
  },
}>;


export class MovieMapper {
  // take a prismaMovie table and converts into Domain Movie table
  

  static toDomain(movie:MovieWithRelations):Movie {
    
    const languages = movie.languages.map(
      (movieLanguage) => 
        new Language(
        movieLanguage.language.id,
        movieLanguage.language.name,
        movieLanguage.language.code
      
      )
    )

    const primaryGenre = new Genre(
  movie.primaryGenre.id,
  movie.primaryGenre.name,
  movie.primaryGenre.slug,
  movie.primaryGenre.isActive,
  movie.primaryGenre.createdAt,
  movie.primaryGenre.updatedAt
);

    const cinemaFormats = movie.cinemaFormats.map(
      (movieCinemaFormat) =>
        new CinemaFormat(
          movieCinemaFormat.cinemaFormat.id,
          movieCinemaFormat.cinemaFormat.name,
          movieCinemaFormat.cinemaFormat.slug,
          movieCinemaFormat.cinemaFormat.isActive,
          movieCinemaFormat.cinemaFormat.createdAt,
          movieCinemaFormat.cinemaFormat.updatedAt
        )
    );

    const cast = movie.cast.map(
      (movieCast) => 
      new MovieCast(
        movieCast.id,
        new Person(
          movieCast.person.id,
          movieCast.person.name,
          movieCast.person.imageUrl
        ),
        movieCast.character,
        )
    )

    const crew = movie.crew.map(
      (movieCrew) => 
      new MovieCrew(
        movieCrew.id,
        new Person(
          movieCrew.person.id,
          movieCrew.person.name,
          movieCrew.person.imageUrl
        ),
        movieCrew.job,

      )
    )

  
 
    return new Movie(
      movie.title,
      movie.slug,
      movie.description,
      movie.duration,
      movie.releaseDate,
      languages,
      primaryGenre,
      Certification[movie.certification],
      cinemaFormats,
      movie.posterUrl,
      movie.posterPublicId,
      movie.backdropUrl,
      movie.backdropPublicId,
      movie.trailerUrl,
      movie.isActive,
      cast,
      crew,
    );
    
  }

    static toPersistence(movie: Movie) {
        return {
      title: movie.title,
      slug: movie.slug,
      description: movie.description,
      duration: movie.duration,
      releaseDate: movie.releaseDate,
      primaryGenreId: movie.primaryGenre.id,
      certification: movie.certification,
          posterUrl: movie.posterUrl,
      posterPublicId: movie.posterPublicId,
          backdropUrl: movie.backdropUrl,
      backdropPublicId: movie.backdropPublicId,
      trailerUrl: movie.trailerUrl,
      isActive: movie.isActive,
        };
    }
}
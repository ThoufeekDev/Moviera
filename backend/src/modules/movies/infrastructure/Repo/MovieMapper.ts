import { Movie as PrismaMovie } from "@prisma/client";
import { Movie } from "../../domain/entities/Movie";
import { Language } from "../../domain/entities/Language";
import { MovieCast } from "../../domain/entities/MovieCast";
import { MovieCrew } from "../../domain/entities/MovieCrew";
import { Person } from "../../domain/entities/Person";
export class MovieMapper {
  // take a prismaMovie table and converts into Domain Movie table
    

  static toDomain(movie: PrismaMovie & {
    languages: {
      language: {
        id: string;
        name: string;
        code: string;
      }
    }[];

    cast: {
      id: string;
      character: string | null;
      person: {
        id: string;
        name: string;
        imageUrl: string | null;
      }
    }[];

    crew: {
      id: string;
      job: string;
      person: {
        id: string;
        name: string;
        imageUrl: string | null;
      }
    }[];
  }): Movie {
    
    const languages = movie.languages.map((movieLanguage) => {
      return new Language(
        movieLanguage.language.id,
        movieLanguage.language.name,
        movieLanguage.language.code
      
      )
    })

    const cast = movie.cast.map((movieCast) => {
     return new MovieCast(
        movieCast.id,
        new Person(
          movieCast.person.id,
          movieCast.person.name,
          movieCast.person.imageUrl
        ),
        movieCast.character,
        )
    })

    const crew = movie.crew.map((movieCrew) => {
     return new MovieCrew(
        movieCrew.id,
        new Person(
          movieCrew.person.id,
          movieCrew.person.name,
          movieCrew.person.imageUrl
        ),
        movieCrew.job,

      )
    })

    return new Movie(
      movie.title,
      movie.slug,
      movie.description,
      movie.duration,
      movie.releaseDate,
      languages,
      movie.genre,
      movie.certificate,
      movie.posterUrl,
      movie.backdropUrl,
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
     
          genre: movie.genre,
          certificate: movie.certificate,
          posterUrl: movie.posterUrl,
          backdropUrl: movie.backdropUrl,
          trailerUrl: movie.trailerUrl,
          isActive: movie.isActive,
        };
    }
}
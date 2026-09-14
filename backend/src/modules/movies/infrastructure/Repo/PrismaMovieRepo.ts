import { Movie } from '../../domain/entities/Movie';
import { IMovieRepository } from '../../domain/repository/IMovieRepository';
import prisma from '../../../../config/database';
import { MovieMapper } from './MovieMapper';

import { UpdateMovieData } from '../../domain/repository/UpdateMovieData';
import { CreateMovieData } from '../../domain/repository/CreateMovieData';

export class PrismaMovieRepository implements IMovieRepository {
  async create(data: CreateMovieData): Promise<Movie | null> {
    const { languages, cast, crew, ...movieData } = data;

    const createdMovie = await prisma.movie.create({
      data: {
        ...movieData,

        languages: {
          create: languages.map((languageId) => ({
            language: {
              connect: {
                id: languageId,
              },
            },
          })),
        },

        cast: {
          create: cast.map((item) => ({
            character: item.character ?? null,
            person: {
              connect: {
                id: item.personId,
              },
            },
          })),
        },

        crew: {
          create: crew.map((item) => ({
            job: item.job,
            person: {
              connect: {
                id: item.personId,
              },
            },
          })),
        },
      },

      include: {
        languages: {
          include: {
            language: true,
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
    });

    return MovieMapper.toDomain(createdMovie);
  }

  async findById(id: string): Promise<Movie | null> {
    const movie = await prisma.movie.findUnique({
      where: { id },
      include: {
        languages: {
          include: {
            language: true,
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
    });

    return movie ? MovieMapper.toDomain(movie) : null;
  }

  async findBySlug(slug: string): Promise<Movie | null> {
    const movie = await prisma.movie.findUnique({
      where: { slug },
      include: {
        languages: {
          include: {
            language: true,
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
    });

    return movie ? MovieMapper.toDomain(movie) : null;
  }

  async findAll(): Promise<Movie[]> {
    const allMovies = await prisma.movie.findMany({
      where: {
        isActive: true,
      },
      include: {
        languages: {
          include: {
            language: true,
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
    });

    /**
     * ! we map because allmovie is an array mapper toDomain takes only one args...
     */
    return allMovies.map((movie) => MovieMapper.toDomain(movie));
  }

  async updateMovie(id: string, movie: UpdateMovieData): Promise<Movie> {
    // Put every remaining property into a new object called movieData.
    const { languages, cast, crew, ...movieData } = movie;

    //   await prisma.movie.update({
    //     where: {
    //       id,
    //     },
    //     data: {
    //       ...movieData,
    //     },
    //       });

    // uupdate Movie table only when normal Movie firlds exist

    if (Object.keys(movieData).length > 0) {
      await prisma.movie.update({
        where: { id },
        data: movieData,
      });
    }

    // ! 2. Update MovieLanguage only when lanugaes was provided

    if (languages !== undefined) {
      await prisma.movieLanguage.deleteMany({
        where: {
          movieId: id,
        },
      });

      if (languages.length > 0) {
        await prisma.movieLanguage.createMany({
          data: languages.map((languageId) => ({
            movieId: id,
            languageId: languageId,
          })),
        });
      }
    }

    // ! Updte MovieCast only when cast was provided

    if (cast !== undefined) {
      await prisma.movieCast.deleteMany({
        where: {
          movieId: id,
        },
      });

      if (cast.length > 0) {
        await prisma.movieCast.createMany({
          data: cast.map((item) => ({
            movieId: id,
            personId: item.personId,
            character: item.character ?? null,
          })),
        });
      }
    }

    if (crew !== undefined) {
      await prisma.movieCrew.deleteMany({
        where: {
          movieId: id,
        },
      });

      if (crew.length > 0) {
        await prisma.movieCrew.createMany({
          data: crew.map((item) => ({
            movieId: id,
            personId: item.personId,
            job: item.job,
          })),
        });
      }
    }

    const updatedMovie = await prisma.movie.findUnique({
      where: {
        id,
      },
      include: {
        languages: {
          include: {
            language: true,
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
    });

    return MovieMapper.toDomain(updatedMovie!);
  }
}

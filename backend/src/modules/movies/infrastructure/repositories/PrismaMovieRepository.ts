import { Movie } from '../../domain/entities/Movie';
import { IMovieRepository } from '../../domain/repositories/IMovieRepository';
import prisma from '../../../../config/database';
import { MovieMapper } from '../mappers/MovieMapper';
import { UpdateMovieData } from '../../domain/types/UpdateMovieData';
import { CreateMovieData } from '../../domain/types/CreateMovieData';

import { MovieQuery } from '../../domain/types/GetMoviesQuery';
import { PaginatedResult } from '../../../../shared/types/Pagination';

import { MovieStatus } from '../../domain/enums/MovieStatus';

export class PrismaMovieRepository implements IMovieRepository {
  async create(data: CreateMovieData): Promise<void> {
    //  desturctuing the data lang,cast,crew are the differenct table
    const { languageIds, genreIds, cinemaFormatIds, cast, crew, ...movieData } = data;

    await prisma.$transaction(async (tx) => {
      const movie = await prisma.movie.create({
        data: movieData,
      });

      await tx.movieLanguage.createMany({
        data: languageIds.map((languageId) => ({
          movieId: movie.id,
          languageId,
        })),
      });

      await tx.movieGenre.createMany({
        data: genreIds.map((genreId) => ({
          movieId: movie.id,
          genreId,
        })),
      });

      await tx.movieCinemaFormat.createMany({
        data: cinemaFormatIds.map((cinemaFormatId) => ({
          movieId: movie.id,
          cinemaFormatId,
        })),
      });

      await tx.movieCast.createMany({
        data: cast.map((item) => ({
          movieId: movie.id,
          personId: item.personId,
          character: item.character ?? null,
        })),
      });

      await tx.movieCrew.createMany({
        data: crew.map((item) => ({
          movieId: movie.id,
          personId: item.personId,
          job: item.job,
        })),
      });
    });
  }

  async findById(id: string): Promise<Movie | null> {
    const movie = await prisma.movie.findUnique({
      where: { id },
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
        genres: {
          include: {
            genre: true,
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
        genres: {
          include: {
            genre: true,
          },
        },
      },
    });

    return movie ? MovieMapper.toDomain(movie) : null;
  }

  async findAll(query: MovieQuery): Promise<PaginatedResult<Movie>> {
    const {
      page = 1,
      limit = 12,
      search,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    const where = {
      ...(search && {
        title: {
          contains: search,
          mode: 'insensitive' as const,
        },
      }),

      ...(status && {
        isActive: status === MovieStatus.ACTIVE,
      }),
    };

    const [movies, total] = await Promise.all([
      prisma.movie.findMany({
        where,
        skip,
        take: limit,

        orderBy: {
          [sortBy]: sortOrder,
        },

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
          genres: {
            include: {
              genre: true,
            },
          },
        },
      }),

      prisma.movie.count({
        where,
      }),
    ]);

    return {
      items: movies.map((movie) => MovieMapper.toDomain(movie)),

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   *
   *
   *  !Implement @transaction on UpdateMovie
   *  ? The main idea is to make all these operation part of one database
   *  * Movie Update
   *  * Languages
   *  * Cinema formats
   *  * Cast
   *  * Crew
   *
   * ^ Wat is transaction ?
   * * treat multiple database operations as one single unit of work
   * ^ The Rule is Eaither everything success or nothing is changed
   *  ! This is often called atomicity
   *
   * ^ why i here use transaction look at my
   * &updateMovie() is not updating just one table
   * * one patch can updates all of these ...
   *
   * &tx means
   * ! Start a transaction. Everything I execute using tx
   * ! belongs to this transaction
   *
   */

  async updateMovie(id: string, movie: UpdateMovieData): Promise<void> {
    // Put every remaining property into a new object called movieData.
    const { languageIds, cinemaFormatIds, genreIds, cast, crew, ...movieData } = movie;

    // ? why Everything inside transaction
    // ? must use the transaction client tx
    await prisma.$transaction(
      async (tx) => {


        if (Object.keys(movieData).length > 0) {
          await tx.movie.update({
            where: { id },
            data: movieData,
          });
        }

        if (genreIds !== undefined) {
          await tx.movieGenre.deleteMany({
            where: { movieId: id },
          });

          if (genreIds.length > 0) {
            await tx.movieGenre.createMany({
              data: genreIds.map((genreId) => ({
                movieId: id,
                genreId,
              })),
            });
          }
        }

        if (languageIds !== undefined) {
          await tx.movieLanguage.deleteMany({
            where: { movieId: id },
          });

          if (languageIds.length > 0) {
            await tx.movieLanguage.createMany({
              data: languageIds.map((languageId) => ({
                movieId: id,
                languageId,
              })),
            });
          }
        }

        if (cinemaFormatIds !== undefined) {
          await tx.movieCinemaFormat.deleteMany({
            where: { movieId: id },
          });

          if (cinemaFormatIds.length > 0) {
            await tx.movieCinemaFormat.createMany({
              data: cinemaFormatIds.map((cinemaFormatId) => ({
                movieId: id,
                cinemaFormatId,
              })),
            });
          }
        }

        if (cast !== undefined) {
          await tx.movieCast.deleteMany({
            where: { movieId: id },
          });

          if (cast.length > 0) {
            await tx.movieCast.createMany({
              data: cast.map((member) => ({
                movieId: id,
                personId: member.personId,
                character: member.character,
              })),
            });
          }
        }

        if (crew !== undefined) {
          await tx.movieCrew.deleteMany({
            where: { movieId: id },
          });

          if (crew.length > 0) {
            await tx.movieCrew.createMany({
              data: crew.map((member) => ({
                movieId: id,
                personId: member.personId,
                job: member.job,
              })),
            });
          }
        }
      }, {
        timeout:15000
      }
    );
  
  }
}

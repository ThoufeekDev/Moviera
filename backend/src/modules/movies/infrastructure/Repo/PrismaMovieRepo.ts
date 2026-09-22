import { Movie } from '../../domain/entities/Movie';
import { IMovieRepository } from '../../domain/repository/IMovieRepository';
import prisma from '../../../../config/database';
import { MovieMapper } from './MovieMapper';

import { UpdateMovieData } from '../../domain/types/UpdateMovieData';
import { CreateMovieData } from '../../domain/types/CreateMovieData';
import { NotFoundError } from '../../../../shared/exceptions/NotFoundError';
import { GetMoviesQuery } from '../../application/dtos/GetMovieQuery';
import { PaginatedMovies } from '../../application/dtos/PaginatedMovies';
import { MovieStatus } from '../../../../shared/enums/MovieStatus';

export class PrismaMovieRepository implements IMovieRepository {
  async create(data: CreateMovieData): Promise<Movie | null> {
    // we are desturctuing the data lang,cast,crew are the differenct table
    const { languageIds, cinemaFormatIds, cast, crew, ...movieData } = data;

    const createdMovie = await prisma.movie.create({
      data: {
        ...movieData,
        // the languages refers to that relation field.
        languages: {
          // create means prisma will create records in the movieLanugage table
          // prismas convenient way of saying INSERT INTO MovieLanguage ...
          // Find the existing Language record whose id equals languageId,
          // and connect this new MovieLanguage record to it."
          create: languageIds.map((languageId) => ({
            language: {
              connect: {
                id: languageId,
              },
            },
          })),
        },
        cinemaFormats: {
          create: cinemaFormatIds.map((cinemaFormatId) => ({
            cinemaFormat: {
              connect: {
                id: cinemaFormatId,
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

      // includes means When you fetch
      //  the Movie, also fetch its related data.

      // !After creating them, return the created Movie together with the requested relations.
      // !When you return the result of this create operation, include these related records in the returned object
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
    });

    return MovieMapper.toDomain(createdMovie);
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
      },
    });

    return movie ? MovieMapper.toDomain(movie) : null;
  }

  async findAll(query: GetMoviesQuery): Promise<PaginatedMovies> {
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
        },
      }),

      prisma.movie.count({
        where,
      }),
    ]);

    return {
      movies: movies.map((movie) => MovieMapper.toDomain(movie)),

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  



    // prisma.movie.count({
    //   where,
    // }),

    // const allMovies = await prisma.movie.findMany({
    //   include: {
    //     primaryGenre:true,
    //     languages: {
    //       include: {
    //         language: true,
    //       },
    //     },
    //     cinemaFormats: {
    //       include: {
    //         cinemaFormat: true,
    //       },
    //     },
    //     cast: {
    //       include: {
    //         person: true,
    //       },
    //     },
    //     crew: {
    //       include: {
    //         person: true,
    //       },
    //     },
    //   },
    // });

    /**
     * ! we map because allmovie is an array mapper toDomain takes only one args...
     */
    // return allMovies.map((movie) => MovieMapper.toDomain(movie));
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

  async updateMovie(id: string, movie: UpdateMovieData):Promise<Movie> {
    // Put every remaining property into a new object called movieData.
    const { languageIds, cinemaFormatIds, cast, crew, ...movieData } = movie;
    

    // ? why Everything inside transaction 
    // ? must use the transaction client tx
await prisma.$transaction(
  async (tx) => {
    const existingMovie = await tx.movie.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingMovie) {
      throw new NotFoundError('Movie not found');
    }

    if (Object.keys(movieData).length > 0) {
      await tx.movie.update({
        where: { id },
        data: movieData,
      });
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
  },
  {
    timeout: 15000,
  },
);


    const updatedMovie = await this.findById(id);
    if (!updatedMovie) throw new NotFoundError("Movie not found");
    return updatedMovie;


    




  }
}

import { Movie } from '../../domain/entities/Movie';
import { IMovieRepository } from '../../domain/repository/IMovieRepository';
import prisma from '../../../../config/database';
import { MovieMapper } from './MovieMapper';

import { UpdateMovieData } from '../../domain/types/UpdateMovieData';
import { CreateMovieData } from '../../domain/types/CreateMovieData';
import { NotFoundError } from '../../../../shared/exceptions/NotFoundError';

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
        primaryGenre:true,
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
        primaryGenre:true,
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
        primaryGenre:true,
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

  async findAll(): Promise<Movie[]> {
    const allMovies = await prisma.movie.findMany({
      include: {
        primaryGenre:true,
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

    /**
     * ! we map because allmovie is an array mapper toDomain takes only one args...
     */
    return allMovies.map((movie) => MovieMapper.toDomain(movie));
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
    prisma.$transaction(async (tx) => {
       
  const existingMovie = await tx.movie.findUnique({
  where: { id },
  select: { id: true },
});

if (!existingMovie) {
  throw new NotFoundError("Movie not found");
}

      // !tx is just a vairable name chose for transaction client


      // ? uupdate Movie table only when normal Movie firlds exist
      if (Object.keys(movieData).length > 0) {
        await tx.movie.update({
          where: { id },
          data: movieData,
        });
      }

      // ! 2. Update MovieLanguage only when lanugaes was provided

      if (languageIds !== undefined) {
        await tx.movieLanguage.deleteMany({
          where: {
            movieId: id,
          },
        });

        if (languageIds.length > 0) {
          await tx.movieLanguage.createMany({
            data: languageIds.map((languageId) => ({
              movieId: id,
              languageId: languageId,
            })),
          });
        }
      }

      // * Cinema format update

      if (cinemaFormatIds !== undefined) {
        await tx.movieCinemaFormat.deleteMany({
          where: {
            movieId: id
          }
        })
      
        if (cinemaFormatIds.length > 0) {
          await tx.movieCinemaFormat.createMany({
            data: cinemaFormatIds.map((cinemaFormatId) => ({
              movieId: id,
              cinemaFormatId,
           
            }))
          })
        }
      }

      // ! Updte MovieCast only when cast was provided

      if (cast !== undefined) {
        await tx.movieCast.deleteMany({
          where: {
            movieId: id,
          },
        });

        if (cast.length > 0) {
          await tx.movieCast.createMany({
            data: cast.map((item) => ({
              movieId: id,
              personId: item.personId,
              character: item.character ?? null,
            })),
          });
        }
      }

      if (crew !== undefined) {
        await tx.movieCrew.deleteMany({
          where: {
            movieId: id,
          },
        });

        if (crew.length > 0) {
          await tx.movieCrew.createMany({
            data: crew.map((item) => ({
              movieId: id,
              personId: item.personId,
              job: item.job,
            })),
          });
        }
      }
   
    });


    const updatedMovie = await this.findById(id);
    if (!updatedMovie) throw new NotFoundError("Movie not found");
    return updatedMovie;

    //        const updatedMovie = await tx.movie.findUnique({
    //   where: {
    //     id,
    //   },
    //   include: {
    //     primaryGenre:true,
    //     languages: {
    //       include: {
    //         language: true,
    //       },
    //     },
    //     cinemaFormats: {
    //       include: {
    //         cinemaFormat:true
    //       }
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

    //       if (!updatedMovie) {
    //   throw new NotFoundError("Movie not found");
    // }
    // return MovieMapper.toDomain(updatedMovie);


    




  }
}

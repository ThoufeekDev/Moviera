import { Movie } from '../../../domain/entities/Movie';
import { IMovieRepository } from '../../../domain/repositories/IMovieRepository';
import { Prisma, PrismaClient } from '@prisma/client';
import { MovieMapper } from '../mappers/MovieMapper';
import { UpdateMovieData } from '../../../domain/types/UpdateMovieData';
import { CreateMovieData } from '../../../domain/types/CreateMovieData';
import { ConflictError } from '../../../../../shared/errors/ConflictError';

export class PrismaMovieRepository implements IMovieRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateMovieData): Promise<void> {
    try {
      const { languageIds, genreIds, cinemaFormatIds, cast, crew, ...movieData } = data;

      await this.prisma.$transaction(
        async (tx) => {
          const movie = await tx.movie.create({
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
        },
        {
          maxWait: 10000,
          timeout: 15000,
        },
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictError('A movie with this slug already exists');
      }
      throw error;
    }
  }

  async findById(id: string): Promise<Movie | null> {
    const movie = await this.prisma.movie.findUnique({
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

  async existsBySlug(slug: string, excludeId?: string): Promise<boolean> {
    const count = await this.prisma.movie.count({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });

    return count > 0;
  }

  async updateMovie(id: string, movie: UpdateMovieData): Promise<void> {
    try {
      const { languageIds, cinemaFormatIds, genreIds, cast, crew, ...movieData } = movie;

      await this.prisma.$transaction(
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
        },
        {
          timeout: 15000,
        },
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictError('A movie with this slug already exists');
      }
      throw error;
    }
  }
}

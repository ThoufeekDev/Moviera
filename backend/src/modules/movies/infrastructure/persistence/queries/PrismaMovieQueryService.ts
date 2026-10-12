import { Prisma, PrismaClient } from '@prisma/client';
import { IMovieQueryService } from '../../../application/ports/IMovieQueryService';
import { MovieAdminListItem } from '../../../application/read-models/MovieAdminListItem';
import { ListMoviesForAdminQuery } from '../../../application/query-params/ListMoviesForAdminQuery';
import { PaginatedResult } from '../../../../../shared/types/Pagination';
import { MovieAdminDetail } from '../../../application/read-models/MovieAdminDetail';
import { MovieStatus } from '../../../application/query-params/MovieStatus';
import { movieAdminListSelect } from '../selects/movieListSelect';
import { MovieAdminListItemMapper } from '../mappers/MovieAdminListItemMapper';
import { toPaginatedResult } from '../../../../../shared/utils/toPaginatedResult';
import { MovieAdminDetailMapper } from '../mappers/MovieAdminDetailMapper';
import { movieAdminDetailSelect } from '../selects/movieAdminDetailSelect';

export class PrismaMovieQueryService implements IMovieQueryService {
  constructor(private readonly prisma: PrismaClient) {}

  async listForAdmin(query: ListMoviesForAdminQuery): Promise<PaginatedResult<MovieAdminListItem>> {
    const {
      page,
      limit,
      search,
      status,
      genreId,
      languageId,
      certification,
      releaseStatus,
      releaseDateFrom,
      releaseDateTo,
      sortBy,
      sortOrder,
    } = query;

    const skip = (page - 1) * limit;
    const now = new Date();

    const andConditions: Prisma.MovieWhereInput[] = [];

    if (search) {
      andConditions.push({
        title: {
          contains: search,
          mode: 'insensitive',
        },
      });
    }

    if (status) {
      andConditions.push({
        isActive: status === MovieStatus.ACTIVE,
      });
    }

    if (releaseStatus === 'NOW_SHOWING') {
      andConditions.push({
        releaseDate: { lte: now },
      });
    } else if (releaseStatus === 'UPCOMING') {
      andConditions.push({
        releaseDate: { gt: now },
      });
    }

    if (releaseDateFrom) {
      andConditions.push({
        releaseDate: { gte: releaseDateFrom },
      });
    }

    if (releaseDateTo) {
      andConditions.push({
        releaseDate: { lte: releaseDateTo },
      });
    }

    if (genreId) {
      andConditions.push({
        genres: {
          some: {
            genreId,
          },
        },
      });
    }

    if (languageId) {
      andConditions.push({
        languages: {
          some: {
            languageId,
          },
        },
      });
    }

    if (certification) {
      andConditions.push({
        certification,
      });
    }

    const where: Prisma.MovieWhereInput =
      andConditions.length > 0 ? { AND: andConditions } : {};

    const [movies, total] = await Promise.all([
      this.prisma.movie.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          {
            [sortBy]: sortOrder,
          },
          {
            id: 'asc',
          },
        ],
        select: movieAdminListSelect,
      }),

      this.prisma.movie.count({ where }),
    ]);

    const items: MovieAdminListItem[] = movies.map(MovieAdminListItemMapper.toAdminItem);

    return toPaginatedResult(items, total, page, limit);
  }

  async findAdminDetailById(id: string): Promise<MovieAdminDetail | null> {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      select: movieAdminDetailSelect,
    });

    return movie ? MovieAdminDetailMapper.toDetail(movie) : null;
  }

  async findAdminDetailBySlug(slug: string): Promise<MovieAdminDetail | null> {
    const movie = await this.prisma.movie.findUnique({
      where: { slug },
      select: movieAdminDetailSelect,
    });

    return movie ? MovieAdminDetailMapper.toDetail(movie) : null;
  }
}

import { PrismaClient } from '@prisma/client';
import { IMovieQueryService } from '../../../application/ports/IMovieQueryService';
import { MovieAdminListItem } from '../../../application/read-models/MovieAdminListItem';
import { ListMoviesForAdminQuery } from '../../../application/queries/ListMoviesForAdminQuery';
import { PaginatedResult } from '../../../../../shared/types/Pagination';
import { MovieAdminDetail } from '../../../application/read-models/MovieAdminDetail';
import { MovieStatus } from '../../../application/queries/MovieStatus';
import { movieAdminListSelect } from '../selects/movieListSelector';
import { MovieAdminListItemMapper } from '../mappers/MovieAdminListItemMapper';
import { toPaginatedResult } from '../../../../../shared/utils/toPaginatedResult';
import { NotFoundError } from '../../../../../shared/errors/NotFoundError';
import { MovieDetailMapper } from '../mappers/MovieDetailMapper';
import { movieDetailSelect } from '../selects/movieDetailSelect';
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

    const releaseDateFilter = {
      ...(releaseStatus === 'NOW_SHOWING' && { lte: now }),
      ...(releaseStatus === 'UPCOMING' && { gt: now}),
      ...(releaseDateFrom && { gte: releaseDateFrom }),
      ...(releaseDateTo && { lte: releaseDateTo }),
    };

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

      ...(Object.keys(releaseDateFilter).length > 0 && {
        releaseDate: releaseDateFilter,
      }),

      ...(genreId && {
        genres: {
          some: {
            genreId,
          },
        },
      }),

      ...(languageId && {
        languages: {
          some: {
            languageId,
          },
        },
      }),

      ...(certification && {
        certification,
      }),
    };

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
      select:movieDetailSelect,
    })

   

      return movie ? MovieDetailMapper.toDetail(movie):null;
    }
  
  async findAdminDetailBySlug(slug: string): Promise<MovieAdminDetail | null> {
    const movie = await this.prisma.movie.findFirst({
      where: { slug },
      select:movieDetailSelect,
    })
    
    if (!movie) throw new NotFoundError('Movie not found');

    return movie ? MovieDetailMapper.toDetail(movie):null;
  }


}




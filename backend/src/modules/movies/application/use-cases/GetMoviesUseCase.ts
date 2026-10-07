// import { Movie } from "../../domain/entities/Movie";
// import { IMovieRepository } from "../../domain/repositories/IMovieRepository";

// import { GetMoviesQueryDTO } from "../dtos/GetMovieQuery";
// import { PaginatedResult } from "../../../../shared/types/Pagination";
// import { ListMoviesQuery } from '../queries/ListMoviesQuery';

// export class GetMoviesUseCase {
//   constructor(private readonly movieRepository: IMovieRepository) {}

//   async execute(query: GetMoviesQueryDTO): Promise<PaginatedResult<Movie>> {
//     const movieQuery: ListMoviesQuery = {
//       page: query.page,
//       limit: query.limit,
//       search: query.search,
//       status: query.status,
//       sortBy: query.sortBy,
//       sortOrder: query.sortOrder,
//     };

//     return this.movieRepository.findAll(movieQuery);
//   }
// }


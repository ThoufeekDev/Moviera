import { Request, Response } from "express";
import { GetMovieUseCase } from "../../application/use-cases/GetMoviesUseCase";
import { successResponse } from "../../../../shared/utils/apiResponse";
import { MovieStatus } from "../../../../shared/enums/MovieStatus";



export class GetMovieController {
    constructor(private readonly getMovieUseCase: GetMovieUseCase) { };


    handle = async (req: Request, res: Response) => {
        const { page, limit, search, status, sortBy, sortOrder } = req.query;
    const result = await this.getMovieUseCase.execute({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search: search ? String(search) : undefined,
      status:
        status === MovieStatus.ACTIVE || status === MovieStatus.INACTIVE
          ? status
          : undefined,
     sortBy:
        sortBy === 'title' ||
        sortBy === 'releaseDate' ||
        sortBy === 'createdAt' ||
        sortBy === 'updatedAt'
          ? sortBy
          : undefined,
      sortOrder:
        sortOrder === 'asc' || sortOrder === 'desc'
          ? sortOrder
          : undefined,
    });
        //  console.log('list all movies',allMovies)

        return successResponse(res,200,true," Movie fetch sucesfully",result)
    }
}
import { Request, Response } from "express";
import { GetMoviesUseCase } from "../../application/use-cases/GetMoviesUseCase";
import { successResponse } from "../../../../shared/utils/apiResponse";
import { MovieStatus } from "../../domain/enums/MovieStatus";
import { MovieResponseMapper } from "../mappers/MovieResponseMapper";



export class GetMovieController {
    constructor(private readonly getMovieUseCase: GetMoviesUseCase) { };


    handle = async (req: Request, res: Response) => {
      const { page, limit, search, status, sortBy, sortOrder } = req.query;
      
    const result = await this.getMovieUseCase.execute({
      page: page ? Number(page) : undefined,
      limit: limit ? Math.min(Number(limit), 12) : undefined,
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

      
      const response = MovieResponseMapper.toListResponse(result)


        return successResponse(res,200,true," Movie fetch sucesfully",response)
    }
}
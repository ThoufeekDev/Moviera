import { IMovieQueryService } from "../../ports/IMovieQueryService";
import { IUseCase } from "../../../../../shared/application/interfaces/IUseCase";
import { MovieAdminDetail } from "../../read-models/MovieAdminDetail";
import { NotFoundError } from "../../../../../shared/errors/NotFoundError";


interface GetMovieByIdForAdminRequest {
    id:string
}

export class GetMovieByIdForAdminUseCase implements IUseCase<GetMovieByIdForAdminRequest,MovieAdminDetail> {
    constructor(private readonly movieQueryService: IMovieQueryService) { };

   async execute(request:GetMovieByIdForAdminRequest): Promise<MovieAdminDetail>{
        const movie = await this.movieQueryService.findAdminDetailById(request.id);
         
       if (!movie) throw new NotFoundError("Movie not found")
       
       return movie
    }
}
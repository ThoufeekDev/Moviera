import { ok } from "../../../../shared/http/response";
import { GetMovieByIdForAdminUseCase } from "../../application/use-cases/queries/GetMovieByIdForAdminUseCase";
import { HttpRequest, HttpResponse } from "../../../../shared/http/HttpTypes";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";


interface GetMovieByIdForAdminParams{
    id: string;
}


export class GetMovieByIdForAdminController {
    constructor(private readonly getMovieByIdForAdminUseCase: GetMovieByIdForAdminUseCase) { };

    execute = async (req:HttpRequest<GetMovieByIdForAdminParams>):Promise<HttpResponse> => {
        const movie = await this.getMovieByIdForAdminUseCase.execute({ id: req.params.id });
       
        return ok(movie,"Movie detail fetch succesful")


        
    }
}
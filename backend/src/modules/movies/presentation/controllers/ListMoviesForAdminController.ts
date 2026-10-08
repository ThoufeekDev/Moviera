import { ListMoviesForAdminUseCase } from "../../application/use-cases/queries/ListMoviesForAdminUseCase";
import { ListMoviesForAdminQuery } from "../../application/queries/ListMoviesForAdminQuery";
import { HttpRequest, HttpResponse } from "../../../../shared/http/HttpTypes";
import { ok } from "../../../../shared/http/response";

export class ListMoviesForAdminController {
    constructor(private readonly listMoviesForAdminUseCase: ListMoviesForAdminUseCase) { };


    execute = async (req: HttpRequest<unknown, unknown, ListMoviesForAdminQuery>): Promise<HttpResponse> => {
        const result = await this.listMoviesForAdminUseCase.execute({query:req.query});

        return ok(result,"Movies fetched succesfully")
    }
}
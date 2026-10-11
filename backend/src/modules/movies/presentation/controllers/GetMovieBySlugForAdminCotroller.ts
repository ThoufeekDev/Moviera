import { ok } from "../../../../shared/http/response";
import { HttpRequest ,HttpResponse} from "../../../../shared/http/HttpTypes";
import { GetMovieBySlugForAdminRequest } from "../../application/queries/GetMovieBySlugForAdminUseCase";
import { GetMovieBySlugForAdminUseCase } from "../../application/queries/GetMovieBySlugForAdminUseCase";


interface GetMovieBySlugForAdminParams extends GetMovieBySlugForAdminRequest { };


export class GetMovieBySlugForAdminController {
    constructor(private readonly getMovieBySlugByAdmin: GetMovieBySlugForAdminUseCase) { };
    
    execute = async (req: HttpRequest<GetMovieBySlugForAdminParams>): Promise<HttpResponse> => {
        console.log('backend triggered');
         
        const movie = await this.getMovieBySlugByAdmin.execute({ slug: req.params.slug });
        console.log('after fetching movie ',movie)
        return ok(movie,"Movie detail fetch succesfull")
    }

}
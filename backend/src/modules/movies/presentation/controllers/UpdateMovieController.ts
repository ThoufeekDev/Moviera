import { Request, Response } from "express";
import { UpdateMovieUseCase } from "../../application/use-cases/UpdateMovieUseCase";
import { successResponse } from "../../../../shared/utils/apiResponse";

export class UpdateMovieController {
    constructor(private readonly udpateMovieUseCase: UpdateMovieUseCase) { };

    handle = async (req: Request<{ id:string }>, res: Response) => {
        const movieToUpdate = req.body
        const udpatedMovie = await this.udpateMovieUseCase.execute(req.params.id, movieToUpdate);

        successResponse(res,200,true,"Movie succesfuly updated",udpatedMovie)
    }
}
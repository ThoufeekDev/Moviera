import { CinemaFormat } from "../../domain/entities/CinemaFormat";
import { ICinemaFormatRepository } from "../../domain/repository/ICinemaFormatRepository";


export class GetCinemaFormatUseCase {
    constructor(
        private readonly repository:ICinemaFormatRepository
    ) { }
    

    async execute(): Promise<CinemaFormat[]>{
       return await this.repository.findAll();
    }
}
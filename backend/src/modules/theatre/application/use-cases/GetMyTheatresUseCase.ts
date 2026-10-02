
import type { ITheatreRepository } from "../../domain/repositories/ITheatreRepository";
import { TheatreWithCity } from "../../domain/types/TheatreWithCity";


export class GetMyTheatresUseCase {
    constructor(
        private readonly theatreRepository:ITheatreRepository
    ) { };

    async execute(adminId: string): Promise<TheatreWithCity[]>{
        return await this.theatreRepository.findByAdminId(adminId);
    }
}
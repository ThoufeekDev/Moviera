import { Screen } from "../../domain/entities/screen.entity";
import type { ITheatreRepository } from "../../domain/repositories/ITheatreRepository";
import type { IScreenRepository } from "../../domain/repositories/IScreenRepository";
import type { CreateScreenDTO } from "../dtos/CreateScreenDTO";
import { generateSlug } from "../../../../shared/utils/generateSlug";
import { ConflictError } from "../../../../shared/exceptions/ConflictError";
import { NotFoundError } from "../../../../shared/exceptions/NotFoundError";
import { ForbiddenError } from "../../../../shared/exceptions/ForbiddenError";
export class CreateScreenUseCase {
    constructor(
        private readonly screenRepository: IScreenRepository,
        private readonly theatreRepository:ITheatreRepository

    ) { }
    

    async execute(screen:CreateScreenDTO):Promise<Screen> {
        
        const theatre =
            await this.theatreRepository.findById(screen.theatreId);

        if (!theatre) throw new NotFoundError("Theatre not found");

        if (!theatre.isActive) throw new ForbiddenError('Theatre is inActive')

        const existingScreen =
            await this.screenRepository.findByName(screen.theatreId, screen.name);
        
        
        if (existingScreen)
            throw new ConflictError('Screen with this name already exists in this theatre');


         const slug = generateSlug(screen.name);
        
        
        return  this.screenRepository.create({
            theatreId: screen.theatreId,
            name: screen.name,
            slug,
           })
    }
}
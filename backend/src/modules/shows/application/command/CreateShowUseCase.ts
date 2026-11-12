import type { IUseCase } from "../../../../shared/application/interfaces/IUseCase";
import { CreateShowDTO } from "../dtos/CreateShowDTO";


export class CreateShowUseCase implements IUseCase<CreateShowDTO,void> {
    async execute(request: CreateShowDTO): Promise<void> {
        
    }
}
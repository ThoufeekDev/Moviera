import { PrismaPersonRepository } from "../Repo/PrismaPersonRepo";
import { GetPersonByIdUseCase } from "../../application/use-cases/GetPersonByIdUseCase";   
import { GetPersonByIdController } from "../../presentation/controllers/GetPersonByIdController";


export function makeGetPersonByIdController() {
    const repo = new PrismaPersonRepository();
    const useCase = new GetPersonByIdUseCase(repo);
    return new GetPersonByIdController(useCase)
}
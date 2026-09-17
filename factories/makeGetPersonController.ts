import { GetPersonController } from "../../presentation/controllers/GetPersonController";
import { PrismaPersonRepository } from "../Repo/PrismaPersonRepo";
import { GetPersonsUseCase } from "../../application/use-cases/GetPersonUseCase";

export function makeGetPersonController() {
    const repo =new  PrismaPersonRepository();
    const useCase = new GetPersonsUseCase(repo);
    return new GetPersonController(useCase)
}
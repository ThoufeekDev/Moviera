import { PrismaLanugageRepository } from "../Repo/PrismaLanguageRepo";
import { GetLanguageController } from "../../presentation/controllers/GetLanguageController";
import { GetLanugageUseCase } from "../../application/use-cases/GetLanugageUseCase";


export function makeGetLanguageContoller() {
    const repo = new PrismaLanugageRepository();
    const useCase = new GetLanugageUseCase(repo);
    return new GetLanguageController(useCase);
}
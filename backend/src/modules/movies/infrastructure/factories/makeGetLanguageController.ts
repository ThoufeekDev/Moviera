import { PrismaLanguageRepository } from "../Repo/PrismaLanguageRepo";
import { GetLanguageController } from "../../presentation/controllers/GetLanguageController";
import { GetLanugageUseCase } from "../../application/use-cases/GetLanugageUseCase";


export function makeGetLanguageContoller() {
    const repo = new PrismaLanguageRepository();
    const useCase = new GetLanugageUseCase(repo);
    return new GetLanguageController(useCase);
}
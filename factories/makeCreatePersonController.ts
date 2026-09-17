import { CreatePersonController } from "../../presentation/controllers/CreatePersonController";
import { CreatePersonUseCase } from "../../application/use-cases/CreatePersonUseCase";
import { PrismaPersonRepository } from "../Repo/PrismaPersonRepo";
import { CloudinaryService } from "../../../../shared/services/cloudinary.service";

export function makeCreatePersonController() {
    const repository = new PrismaPersonRepository();
    const createPersonUseCase = new CreatePersonUseCase(repository);
    const cloudinaryService = new CloudinaryService()
    return new CreatePersonController(createPersonUseCase,cloudinaryService)
}
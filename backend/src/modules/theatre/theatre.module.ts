import { PrismaTheatreRepository } from "./infrastructure/repositories/PrismaTheatreRepository";
import { PrismaScreenRepository } from "./infrastructure/repositories/PrismaScreenRepository";
import { PrismaSeatRepository } from "./infrastructure/repositories/PrismaSeatRepository";



                     // ! UseCases
import { CreateScreenUseCase } from "./application/use-cases/CreateScreenUseCase";
import { CreateSeatUseCase } from "./application/use-cases/CreateSeatUseCase";

                    // ! Controllers
import { CreateScreenController } from "./presentation/controllers/CreateScreenController";
import { CreateSeatController } from './presentation/controllers/CreateSeatController';


export function buildTheatreModule() {

    // &repositories

    const theatreRepository = new PrismaTheatreRepository();
    const screenRepository = new PrismaScreenRepository();
    const seatRepository = new PrismaSeatRepository();

    // ^ Controllers

    const createScreenController = new CreateScreenController(
        new CreateScreenUseCase(screenRepository,theatreRepository)
    )

    const createSeatController = new CreateSeatController(
        new CreateSeatUseCase(seatRepository,screenRepository)
    )



    return {
        createScreenController,
        createSeatController,
    }
}
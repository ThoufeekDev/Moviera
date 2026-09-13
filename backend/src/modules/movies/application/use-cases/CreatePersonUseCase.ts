import { ConflictError } from "../../../../shared/exceptions/ConflictError";
import { Person } from "../../domain/entities/Person";
import { IPersonRepository } from "../../domain/repository/IPersonRepository";
import { CreatePersonDTO } from "../dtos/CreatePersonDTO";

export class CreatePersonUseCase {
    constructor(private readonly personRepository: IPersonRepository) { };

    async execute(data: CreatePersonDTO): Promise<Person>{
        const existingUser = await this.personRepository.findByName(data.name);

        if (existingUser) throw new ConflictError("Person already exists");

        const person = new Person(
            "",
            data.name,
            data.imageUrl ?? null
        )

        return this.personRepository.create(person)
     }
}
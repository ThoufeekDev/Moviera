import { IPersonRepository } from '../../domain/repository/IPersonRepository';
import { Person } from '../../domain/entities/Person';

export class GetPersonsUseCase {
  constructor(private readonly personRepository: IPersonRepository) {}

  async execute(): Promise<Person[]> {
    return this.personRepository.findAll();
  }
}

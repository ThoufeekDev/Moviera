import { IPersonRepository } from '../../domain/repositories/IPersonRepository';
import { Person } from '../../domain/entities/Person';

export class ListPersonsUseCase {
  constructor(private readonly personRepository: IPersonRepository) {}

  async execute(): Promise<Person[]> {
    return this.personRepository.findAll();
  }
}

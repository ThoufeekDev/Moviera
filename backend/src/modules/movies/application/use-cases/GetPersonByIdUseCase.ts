import { IPersonRepository } from '../../domain/repository/IPersonRepository';
import { Person } from '../../domain/entities/Person';
import { NotFoundError } from '../../../../shared/exceptions/NotFoundError';

export class GetPersonByIdUseCase {
  constructor(private readonly personRepository: IPersonRepository) {}

  async execute(id: string): Promise<Person> {
    const person = await this.personRepository.findById(id);
         
      
     
    if (!person) 
      throw new NotFoundError('Person not found');

    return person;
  }
}

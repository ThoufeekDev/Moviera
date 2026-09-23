import { IStorageService } from '../../../../shared/domain/services/IStorageService';
import { ConflictError } from '../../../../shared/exceptions/ConflictError';
import { Person } from '../../domain/entities/Person';
import { IPersonRepository } from '../../domain/repository/IPersonRepository';
import { CreatePersonDTO } from '../dtos/CreatePersonDTO';

export class CreatePersonUseCase {
  constructor(
    private readonly personRepository: IPersonRepository,
    private readonly storageService: IStorageService,
  ) {}

  async execute(data: CreatePersonDTO): Promise<Person> {
    const existingPerson = await this.personRepository.findByName(data.name);

    if (existingPerson) throw new ConflictError('Person already exists');

    const image = data.imageFile
      ? await this.storageService.uploadImage(data.imageFile.buffer, 'moviera/people')
      : null;

    const person = new Person('', data.name, image?.secureUrl ?? null);

    return this.personRepository.create(person);
  }
}

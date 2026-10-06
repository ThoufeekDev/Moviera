import { IStorageService } from '../../../../shared/domain/services/IStorageService';
import { ConflictError } from '../../../../shared/exceptions/ConflictError';
import { Person } from '../../domain/entities/Person';
import { IPersonRepository } from '../../domain/repositories/IPersonRepository';
import { CreatePersonDTO } from '../dtos/CreatePersonDTO';

export class CreatePersonUseCase {
  constructor(
    private readonly personRepository: IPersonRepository,
    private readonly storageService: IStorageService,
  ) {}

async execute(data: CreatePersonDTO): Promise<Person> {
  const existingPerson = await this.personRepository.findByName(data.name);

  if (existingPerson) {
    throw new ConflictError("Person already exists");
  }

  const image = data.imageFile
    ? await this.storageService.uploadImage(
        data.imageFile.buffer,
        "moviera/people",
      )
    : null;

  try {
    const person = new Person(
      "",
      data.name,
      image?.secureUrl ?? null,
    );

    return await this.personRepository.create(person);
  } catch (error) {
    if (image?.publicId) {
      try {
        await this.storageService.deleteImage(image.publicId);
      } catch (cleanupError) {
        console.error(
          `Failed to rollback person image: ${image.publicId}`,
          cleanupError,
        );
      }
    }

    throw error;
  }
}
}

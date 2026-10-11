import { IStorageService } from '../../../../shared/application/ports/IStorageService';
import { ConflictError } from '../../../../shared/errors/ConflictError';
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
      return await this.personRepository.create({
        name: data.name,
        imageUrl: image?.secureUrl ?? null,
        imagePublicId: image?.publicId ?? null,
      });
    } catch (error) {
      if (image?.publicId) {
        try {
          await this.storageService.deleteImage(image.publicId);
        } catch (cleanupError) {
          console.error(`Failed to cleanup orphaned image with publicId: ${image.publicId}`, cleanupError);
        }
      }

      throw error;
    }
  }
}

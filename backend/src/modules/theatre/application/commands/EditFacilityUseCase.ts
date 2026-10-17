import { IUseCase } from '../../../../shared/application/interfaces/IUseCase';
import { ConflictError } from '../../../../shared/errors/ConflictError';
import { NotFoundError } from '../../../../shared/errors/NotFoundError';
import { IFacilityRepository } from '../../domain/repositories/IFacilityRepository';
import { EditFacilityDTO } from '../dtos/EditFacilityDTO';
import { FacilityResultDTO } from '../dtos/FacilityResultDTO';

export class EditFacilityUseCase implements IUseCase<EditFacilityDTO, FacilityResultDTO> {
  constructor(private readonly facilityRepository: IFacilityRepository) {}

  async execute(request: EditFacilityDTO): Promise<FacilityResultDTO> {
    const facility = await this.facilityRepository.findById(request.id);
    if (!facility) {
      throw new NotFoundError('Facility not found.');
    }

    const normalizedName = request.name.trim().replace(/\s+/g, ' ');
    const normalizedDescription = request.description?.trim() || null;
    const normalizedIconKey = request.iconKey?.trim() || null;

    // Duplicate check excluding self
    const nameConflict = await this.facilityRepository.existsByName(normalizedName, request.id);
    if (nameConflict) {
      throw new ConflictError('A facility with this name already exists.');
    }

    // Update details (slug remains unchanged)
    facility.updateDetails({
      name: normalizedName,
      description: normalizedDescription,
      iconKey: normalizedIconKey,
    });

    const updated = await this.facilityRepository.update(facility);

    return {
      id: updated.id,
      name: updated.name,
      slug: updated.slug,
      description: updated.description,
      iconKey: updated.iconKey,
      isActive: updated.isActive,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}

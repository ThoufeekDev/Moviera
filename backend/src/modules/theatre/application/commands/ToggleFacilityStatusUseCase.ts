import { IUseCase } from '../../../../shared/application/interfaces/IUseCase';
import { NotFoundError } from '../../../../shared/errors/NotFoundError';
import { IFacilityRepository } from '../../domain/repositories/IFacilityRepository';
import { FacilityResultDTO } from '../dtos/FacilityResultDTO';
import { ToggleFacilityStatusDTO } from '../dtos/ToggleFacilityStatusDTO';

export class ToggleFacilityStatusUseCase
  implements IUseCase<ToggleFacilityStatusDTO, FacilityResultDTO>
{
  constructor(private readonly facilityRepository: IFacilityRepository) {}

  async execute(request: ToggleFacilityStatusDTO): Promise<FacilityResultDTO> {
    const facility = await this.facilityRepository.findById(request.id);
    if (!facility) {
      throw new NotFoundError('Facility not found.');
    }

    facility.updateStatus(request.isActive);

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

import { IUseCase } from '../../../../shared/application/interfaces/IUseCase';
import { ConflictError } from '../../../../shared/errors/ConflictError';
import { generateSlug } from '../../../../shared/utils/generateSlug';
import { Facility } from '../../domain/entities/Facility';
import { IFacilityRepository } from '../../domain/repositories/IFacilityRepository';
import { CreateFacilityDTO } from '../dtos/CreateFacilityDTO';
import { FacilityResultDTO } from '../dtos/FacilityResultDTO';

export class CreateFacilityUseCase implements IUseCase<CreateFacilityDTO, FacilityResultDTO> {
  constructor(private readonly facilityRepository: IFacilityRepository) {}

  async execute(request: CreateFacilityDTO): Promise<FacilityResultDTO> {
    const normalizedName = request.name.trim().replace(/\s+/g, ' ');
    const normalizedDescription = request.description?.trim() || null;
    const normalizedIconKey = request.iconKey?.trim() || null;

    // Check duplicate name (case-insensitive)
    const exists = await this.facilityRepository.existsByName(normalizedName);
    if (exists) {
      throw new ConflictError('A facility with this name already exists.');
    }

    // Generate unique slug
    const baseSlug = generateSlug(normalizedName) || 'facility';
    let slug = baseSlug;
    let suffix = 2;
    while (await this.facilityRepository.existsBySlug(slug)) {
      slug = `${baseSlug}-${suffix}`;
      suffix++;
    }

    const facility = Facility.create({
      id: '',
      name: normalizedName,
      slug,
      description: normalizedDescription,
      iconKey: normalizedIconKey,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const created = await this.facilityRepository.create(facility);

    return {
      id: created.id,
      name: created.name,
      slug: created.slug,
      description: created.description,
      iconKey: created.iconKey,
      isActive: created.isActive,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };
  }
}

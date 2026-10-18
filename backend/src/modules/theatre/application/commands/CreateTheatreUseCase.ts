import { IUseCase } from '../../../../shared/application/interfaces/IUseCase';
import { ITheatreRepository } from '../../domain/repositories/ITheatreRepository';
import { IStorageService } from '../../../../shared/application/ports/IStorageService';
import { CreatedTheatreResult } from '../read-models/CreatedTheatreResult';
import { TheatreSlugService } from '../services/TheatreSlugService';
import { CreateTheatreDTO } from '../dtos/CreateTheatreDTO';
import { Theatre } from '../../domain/entities/Theatre';
import { IFacilityRepository } from '../../domain/repositories/IFacilityRepository';
import { ConflictError } from '../../../../shared/errors/ConflictError';

import { ResolveTheatreLocationService } from '../services/ResolveTheatreLocationService';

export class CreateTheatreUseCase implements IUseCase<CreateTheatreDTO, CreatedTheatreResult> {
  constructor(
    private readonly theatreRepository: ITheatreRepository,
    private readonly theatreSlugService: TheatreSlugService,
    private readonly locationService: ResolveTheatreLocationService,
    private readonly facilityRepository:IFacilityRepository,
    private readonly storageService?: IStorageService,
  ) {}

  async execute(request: CreateTheatreDTO): Promise<CreatedTheatreResult> {


    const location = await this.locationService.execute({
  cityId: request.cityId,
  areaId: request.areaId,
      cityName: request.cityName,
      areaName: request.areaName,
      district: request.district,
      state: request.state,
      country: request.country,
    });

    const resolvedCityId = location.cityId;
    const resolvedAreaId = location.areaId;

    // 2. Normalize inputs
    const normalizedName = request.name.trim();
    const normalizedAddress = request.address.trim();
    const normalizedDescription = request.description?.trim() || null;
    const normalizedEmail = request.email?.trim().toLowerCase() || null;
    const normalizedPhone = request.phone?.trim() || null;
    const normalizedPincode = request.pincode?.trim() || null;
    const normalizedLandmark = request.landmark?.trim() || null;
    const normalizedLicense = request.licenseNumber?.trim() || null;
    const latitude = typeof request.latitude === 'number' ? request.latitude : null;
    const longitude = typeof request.longitude === 'number' ? request.longitude : null;
    const isActive = request.isActive !== undefined ? request.isActive : true;


    const facilityIds = [...new Set(request.facilityIds ?? [])];

    if (facilityIds.length > 0) {
      const facilities = await this.facilityRepository.findActiveByIds(facilityIds);

      if (facilities.length !== facilityIds.length) {
        throw new ConflictError('One or more selected facilities do not exist or are inactive.');
      }
    }


    // 3. Duplicate checks:
    // Check theatre name uniqueness within the same city (case-insensitive)
    const existingByName = await this.theatreRepository.findByNameAndCity(
      normalizedName,
      resolvedCityId,
    );

    if (existingByName) {
      if (existingByName.deletedAt) {
        throw new ConflictError(
          'A theatre with this name was previously registered in this city and is currently archived/deleted.',
        );
      }

      throw new ConflictError('A theatre with this name already exists in this city.');
    }

    // Check licenseNumber uniqueness if provided
    if (normalizedLicense) {
      const existingLicense = await this.theatreRepository.findByLicenseNumber(normalizedLicense);

      if (existingLicense) {
        if (existingLicense.deletedAt) {
          throw new ConflictError(
            'A theatre with this licence number was previously registered and is currently archived/deleted.',
          );
        }

        throw new ConflictError('A theatre with this licence number already exists.');
      }
    }

    // 4. Generate unique slug per city
    const slug = await this.theatreSlugService.generateUniqueSlug(normalizedName, resolvedCityId);

    // 5. Upload optional logo image
    let logoUrl: string | null = null;
    let logoPublicId: string | null = null;

    if (request.logoFile?.buffer && this.storageService) {
      const uploadRes = await this.storageService.uploadImage(
        request.logoFile.buffer,
        'theatres/logos',
      );
      logoUrl = uploadRes.secureUrl;
      logoPublicId = uploadRes.publicId;
    }

    // 6. Build domain entity
    const theatre = Theatre.create({
      id: '',
      cityId: resolvedCityId,
      areaId: resolvedAreaId,
      name: normalizedName,
      slug,
      address: normalizedAddress,
      description: normalizedDescription,
      logoUrl,
      logoPublicId,
      email: normalizedEmail,
      phone: normalizedPhone,
      latitude,
      longitude,
      googlePlaceId: request.googlePlaceId ?? null,
      pincode: normalizedPincode,
      landmark: normalizedLandmark,
      isActive,
      licenseNumber: normalizedLicense,
      createdById: request.createdById,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });


    

    // 7. Persist to repository with rollback cleanup on error
    try {
      const created = await this.theatreRepository.create(theatre);

      return {
        id: created.id,
        cityId: created.cityId,
        areaId: created.areaId,
        googlePlaceId:created.googlePlaceId,
        name: created.name,
        slug: created.slug,
        address: created.address,
        description: created.description,
        logoUrl: created.logoUrl,
        logoPublicId: created.logoPublicId,
        email: created.email,
        phone: created.phone,
        latitude: created.latitude,
        longitude: created.longitude,
        pincode: created.pincode,
        landmark: created.landmark,
        isActive: created.isActive,
        licenseNumber: created.licenseNumber,
        createdById: created.createdById,
        createdAt: created.createdAt,
        updatedAt: created.updatedAt,
      };
    } catch (error) {
      if (logoPublicId && this.storageService) {
        try {
          await this.storageService.deleteImage(logoPublicId);
        } catch {}
      }

      throw error;
    }
  }
}

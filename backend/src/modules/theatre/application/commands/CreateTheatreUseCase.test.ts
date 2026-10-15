import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateTheatreUseCase } from './CreateTheatreUseCase';
import { NotFoundError } from '../../../../shared/errors/NotFoundError';
import { ConflictError } from '../../../../shared/errors/ConflictError';
import { Theatre } from '../../domain/entities/Theatre';

describe('CreateTheatreUseCase', () => {
  let mockTheatreRepo: any;
  let mockSlugService: any;
  let mockStorageService: any;
  let useCase: CreateTheatreUseCase;

  beforeEach(() => {
    mockTheatreRepo = {
      cityExists: vi.fn(),
      findByNameAndCity: vi.fn(),
      findByLicenseNumber: vi.fn(),
      existsByCityAndSlug: vi.fn(),
      create: vi.fn(),
    };

    mockSlugService = {
      generateUniqueSlug: vi.fn().mockResolvedValue('pvr-cinemas-koramangala'),
    };

    mockStorageService = {
      uploadImage: vi.fn().mockResolvedValue({
        secureUrl: 'https://cloudinary.com/theatres/logo.webp',
        publicId: 'theatres/logo_123',
      }),
      deleteImage: vi.fn().mockResolvedValue(undefined),
    };

    useCase = new CreateTheatreUseCase(
      mockTheatreRepo,
      mockSlugService,
      mockStorageService,
    );
  });

  it('should successfully create a theatre with all fields and an uploaded logo', async () => {
    mockTheatreRepo.cityExists.mockResolvedValue(true);
    mockTheatreRepo.findByNameAndCity.mockResolvedValue(null);
    mockTheatreRepo.findByLicenseNumber.mockResolvedValue(null);
    mockTheatreRepo.create.mockImplementation(async (theatre: Theatre) => theatre);

    const result = await useCase.execute({
      cityId: 'city-blr',
      name: '  PVR Cinemas Koramangala  ',
      address: '  80 Feet Road, 4th Block  ',
      description: '  Luxury multiplex  ',
      email: '  INFO@PVRCINEMAS.COM  ',
      phone: '  +919876543210  ',
      pincode: '560034',
      landmark: 'Opposite Forum Mall',
      licenseNumber: '  LIC-KA-2024-999  ',
      latitude: 12.9352,
      longitude: 77.6245,
      isActive: true,
      createdById: 'admin-1',
      logoFile: { buffer: Buffer.from('fake-logo') },
    });

    expect(mockTheatreRepo.cityExists).toHaveBeenCalledWith('city-blr');
    expect(mockStorageService.uploadImage).toHaveBeenCalledWith(expect.any(Buffer), 'theatres/logos');
    expect(mockSlugService.generateUniqueSlug).toHaveBeenCalledWith('PVR Cinemas Koramangala', 'city-blr');
    expect(mockTheatreRepo.create).toHaveBeenCalled();

    expect(result.name).toBe('PVR Cinemas Koramangala');
    expect(result.slug).toBe('pvr-cinemas-koramangala');
    expect(result.email).toBe('info@pvrcinemas.com');
    expect(result.licenseNumber).toBe('LIC-KA-2024-999');
    expect(result.logoUrl).toBe('https://cloudinary.com/theatres/logo.webp');
    expect(result.logoPublicId).toBe('theatres/logo_123');
    expect(result.latitude).toBe(12.9352);
    expect(result.longitude).toBe(77.6245);
    expect(result.createdById).toBe('admin-1');
  });

  it('should create a theatre with only required fields (and normalize blanks to null)', async () => {
    mockTheatreRepo.cityExists.mockResolvedValue(true);
    mockTheatreRepo.findByNameAndCity.mockResolvedValue(null);
    mockTheatreRepo.create.mockImplementation(async (theatre: Theatre) => theatre);

    const result = await useCase.execute({
      cityId: 'city-blr',
      name: 'Inox Lido',
      address: 'Ulsoor, MG Road',
      createdById: 'admin-1',
      licenseNumber: '   ', // whitespace only
      description: '',
      email: '',
      phone: '',
      pincode: '',
      landmark: '',
    });

    expect(mockTheatreRepo.findByLicenseNumber).not.toHaveBeenCalled();
    expect(result.name).toBe('Inox Lido');
    expect(result.licenseNumber).toBeNull();
    expect(result.description).toBeNull();
    expect(result.email).toBeNull();
    expect(result.phone).toBeNull();
    expect(result.pincode).toBeNull();
    expect(result.landmark).toBeNull();
    expect(result.latitude).toBeNull();
    expect(result.longitude).toBeNull();
    expect(result.logoUrl).toBeNull();
  });

  it('should throw NotFoundError if city does not exist or is inactive', async () => {
    mockTheatreRepo.cityExists.mockResolvedValue(false);

    await expect(
      useCase.execute({
        cityId: 'non-existent-city',
        name: 'Cinema World',
        address: 'Main Road',
        createdById: 'admin-1',
      }),
    ).rejects.toThrow(NotFoundError);

    expect(mockTheatreRepo.create).not.toHaveBeenCalled();
  });

  it('should throw 409 ConflictError if theatre with same name exists in same city', async () => {
    mockTheatreRepo.cityExists.mockResolvedValue(true);
    mockTheatreRepo.findByNameAndCity.mockResolvedValue(
      Theatre.create({
        id: 'th-1',
        cityId: 'city-blr',
        name: 'PVR Cinemas Koramangala',
        slug: 'pvr-cinemas-koramangala',
        address: 'Road 1',
        isActive: true,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    await expect(
      useCase.execute({
        cityId: 'city-blr',
        name: 'pvr cinemas koramangala',
        address: 'Road 2',
        createdById: 'admin-1',
      }),
    ).rejects.toThrow(new ConflictError('A theatre with this name already exists in this city.'));
  });

  it('should mention soft-deleted status if conflicting theatre with same name was deleted', async () => {
    mockTheatreRepo.cityExists.mockResolvedValue(true);
    mockTheatreRepo.findByNameAndCity.mockResolvedValue(
      Theatre.create({
        id: 'th-1',
        cityId: 'city-blr',
        name: 'Old Cinema',
        slug: 'old-cinema',
        address: 'Road 1',
        isActive: false,
        deletedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    await expect(
      useCase.execute({
        cityId: 'city-blr',
        name: 'Old Cinema',
        address: 'Road 1',
        createdById: 'admin-1',
      }),
    ).rejects.toThrow(new ConflictError('A theatre with this name was previously registered in this city and is currently archived/deleted.'));
  });

  it('should allow same theatre name in a different city', async () => {
    mockTheatreRepo.cityExists.mockResolvedValue(true);
    mockTheatreRepo.findByNameAndCity.mockResolvedValue(null);
    mockTheatreRepo.create.mockImplementation(async (theatre: Theatre) => theatre);

    const result = await useCase.execute({
      cityId: 'city-delhi',
      name: 'PVR Cinemas Koramangala',
      address: 'Connaught Place',
      createdById: 'admin-1',
    });

    expect(result.cityId).toBe('city-delhi');
    expect(result.name).toBe('PVR Cinemas Koramangala');
  });

  it('should throw ConflictError if licenseNumber is already taken', async () => {
    mockTheatreRepo.cityExists.mockResolvedValue(true);
    mockTheatreRepo.findByNameAndCity.mockResolvedValue(null);
    mockTheatreRepo.findByLicenseNumber.mockResolvedValue(
      Theatre.create({
        id: 'th-2',
        cityId: 'city-other',
        name: 'Another Theatre',
        slug: 'another-theatre',
        address: 'Road 3',
        licenseNumber: 'LIC-UNIQUE-123',
        isActive: true,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    await expect(
      useCase.execute({
        cityId: 'city-blr',
        name: 'New Theatre',
        address: 'Road 4',
        licenseNumber: 'LIC-UNIQUE-123',
        createdById: 'admin-1',
      }),
    ).rejects.toThrow(new ConflictError('A theatre with this licence number already exists.'));
  });

  it('should specify archived status if conflicting licenseNumber belongs to soft-deleted theatre', async () => {
    mockTheatreRepo.cityExists.mockResolvedValue(true);
    mockTheatreRepo.findByNameAndCity.mockResolvedValue(null);
    mockTheatreRepo.findByLicenseNumber.mockResolvedValue(
      Theatre.create({
        id: 'th-2',
        cityId: 'city-other',
        name: 'Old Archived Theatre',
        slug: 'old-archived-theatre',
        address: 'Road 3',
        licenseNumber: 'LIC-OLD-123',
        isActive: false,
        deletedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    await expect(
      useCase.execute({
        cityId: 'city-blr',
        name: 'New Theatre',
        address: 'Road 4',
        licenseNumber: 'LIC-OLD-123',
        createdById: 'admin-1',
      }),
    ).rejects.toThrow(new ConflictError('A theatre with this licence number was previously registered and is currently archived/deleted.'));
  });

  it('should clean up uploaded logo if theatre persistence fails', async () => {
    mockTheatreRepo.cityExists.mockResolvedValue(true);
    mockTheatreRepo.findByNameAndCity.mockResolvedValue(null);
    mockTheatreRepo.create.mockRejectedValue(new Error('Database write failure'));

    await expect(
      useCase.execute({
        cityId: 'city-blr',
        name: 'Failing Theatre',
        address: 'Some Address',
        createdById: 'admin-1',
        logoFile: { buffer: Buffer.from('image') },
      }),
    ).rejects.toThrow('Database write failure');

    expect(mockStorageService.deleteImage).toHaveBeenCalledWith('theatres/logo_123');
  });
});

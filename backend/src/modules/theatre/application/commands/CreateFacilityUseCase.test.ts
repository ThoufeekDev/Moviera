import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateFacilityUseCase } from './CreateFacilityUseCase';
import { ConflictError } from '../../../../shared/errors/ConflictError';
import { Facility } from '../../domain/entities/Facility';

describe('CreateFacilityUseCase', () => {
  let mockFacilityRepo: any;
  let useCase: CreateFacilityUseCase;

  beforeEach(() => {
    mockFacilityRepo = {
      findById: vi.fn(),
      findByName: vi.fn(),
      findBySlug: vi.fn(),
      existsByName: vi.fn(),
      existsBySlug: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    };

    useCase = new CreateFacilityUseCase(mockFacilityRepo);
  });

  it('should successfully create a facility with trimmed name, collapsed spaces, and valid iconKey', async () => {
    mockFacilityRepo.existsByName.mockResolvedValue(false);
    mockFacilityRepo.existsBySlug.mockResolvedValue(false);
    mockFacilityRepo.create.mockImplementation(async (f: Facility) => f);

    const result = await useCase.execute({
      name: '  Wheelchair   Access  ',
      description: '  Ramps and accessible spaces.  ',
      iconKey: 'wheelchair_access',
    });

    expect(result.name).toBe('Wheelchair Access');
    expect(result.slug).toBe('wheelchair-access');
    expect(result.description).toBe('Ramps and accessible spaces.');
    expect(result.iconKey).toBe('wheelchair_access');
    expect(result.isActive).toBe(true);
    expect(mockFacilityRepo.existsByName).toHaveBeenCalledWith('Wheelchair Access');
  });

  it('should throw ConflictError (409) if duplicate name exists in different casing', async () => {
    mockFacilityRepo.existsByName.mockResolvedValue(true);

    await expect(
      useCase.execute({
        name: 'PARKING',
        iconKey: 'parking',
      }),
    ).rejects.toThrow(ConflictError);

    await expect(
      useCase.execute({
        name: 'PARKING',
        iconKey: 'parking',
      }),
    ).rejects.toThrow('A facility with this name already exists.');
  });

  it('should append suffix when slug collision exists', async () => {
    mockFacilityRepo.existsByName.mockResolvedValue(false);
    // First slug exists, second does not
    mockFacilityRepo.existsBySlug
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);
    mockFacilityRepo.create.mockImplementation(async (f: Facility) => f);

    const result = await useCase.execute({
      name: 'VIP Lounge',
      iconKey: 'lounge',
    });

    expect(result.slug).toBe('vip-lounge-2');
  });
});

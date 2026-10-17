import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EditFacilityUseCase } from './EditFacilityUseCase';
import { ConflictError } from '../../../../shared/errors/ConflictError';
import { NotFoundError } from '../../../../shared/errors/NotFoundError';
import { Facility } from '../../domain/entities/Facility';

describe('EditFacilityUseCase', () => {
  let mockFacilityRepo: any;
  let useCase: EditFacilityUseCase;

  const existingFacility = Facility.create({
    id: 'fac-1',
    name: 'Food Court',
    slug: 'food-court',
    description: 'Snacks and beverages',
    iconKey: 'food_court',
    isActive: true,
  });

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

    useCase = new EditFacilityUseCase(mockFacilityRepo);
  });

  it('should successfully edit facility details while keeping slug unchanged', async () => {
    mockFacilityRepo.findById.mockResolvedValue(existingFacility);
    mockFacilityRepo.existsByName.mockResolvedValue(false);
    mockFacilityRepo.update.mockImplementation(async (f: Facility) => f);

    const result = await useCase.execute({
      id: 'fac-1',
      name: '  Gourmet Food Court  ',
      description: '  Deluxe gourmet cafeteria and hot snacks.  ',
      iconKey: 'food_court',
    });

    expect(result.id).toBe('fac-1');
    expect(result.name).toBe('Gourmet Food Court');
    expect(result.description).toBe('Deluxe gourmet cafeteria and hot snacks.');
    expect(result.slug).toBe('food-court'); // Unchanged!
    expect(mockFacilityRepo.existsByName).toHaveBeenCalledWith('Gourmet Food Court', 'fac-1');
  });

  it('should throw NotFoundError if facility does not exist', async () => {
    mockFacilityRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        id: 'non-existent',
        name: 'Parking',
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw ConflictError (409) if duplicate name belongs to another facility', async () => {
    mockFacilityRepo.findById.mockResolvedValue(existingFacility);
    mockFacilityRepo.existsByName.mockResolvedValue(true);

    await expect(
      useCase.execute({
        id: 'fac-1',
        name: 'Wheelchair Access',
      }),
    ).rejects.toThrow(ConflictError);
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ToggleFacilityStatusUseCase } from './ToggleFacilityStatusUseCase';
import { NotFoundError } from '../../../../shared/errors/NotFoundError';
import { Facility } from '../../domain/entities/Facility';

describe('ToggleFacilityStatusUseCase', () => {
  let mockFacilityRepo: any;
  let useCase: ToggleFacilityStatusUseCase;

  const facility = Facility.create({
    id: 'fac-1',
    name: 'Parking',
    slug: 'parking',
    description: 'Vehicle parking',
    iconKey: 'parking',
    isActive: true,
  });

  beforeEach(() => {
    mockFacilityRepo = {
      findById: vi.fn(),
      update: vi.fn(),
    };

    useCase = new ToggleFacilityStatusUseCase(mockFacilityRepo);
  });

  it('should deactivate an active facility without deleting assignments', async () => {
    mockFacilityRepo.findById.mockResolvedValue(facility);
    mockFacilityRepo.update.mockImplementation(async (f: Facility) => f);

    const result = await useCase.execute({
      id: 'fac-1',
      isActive: false,
    });

    expect(result.id).toBe('fac-1');
    expect(result.isActive).toBe(false);
    expect(mockFacilityRepo.update).toHaveBeenCalledWith(
      expect.objectContaining({
        isActive: false,
      }),
    );
  });

  it('should reactivate an inactive facility', async () => {
    const inactiveFacility = Facility.create({
      id: 'fac-2',
      name: 'Wi-Fi',
      slug: 'wi-fi',
      isActive: false,
    });
    mockFacilityRepo.findById.mockResolvedValue(inactiveFacility);
    mockFacilityRepo.update.mockImplementation(async (f: Facility) => f);

    const result = await useCase.execute({
      id: 'fac-2',
      isActive: true,
    });

    expect(result.id).toBe('fac-2');
    expect(result.isActive).toBe(true);
  });

  it('should throw NotFoundError if facility does not exist', async () => {
    mockFacilityRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        id: 'missing-fac',
        isActive: false,
      }),
    ).rejects.toThrow(NotFoundError);
  });
});

import { describe, it, expect, vi } from 'vitest';
import { ListCitiesUseCase } from './ListCitiesUseCase';
import { ITheatreQueryService } from '../ports/ITheatreQueryService';
import { CityOption } from '../read-models/CityOption';

describe('ListCitiesUseCase', () => {
  it('should call theatreQueryService.listCities and return city options', async () => {
    const mockCities: CityOption[] = [
      { id: 'city-1', name: 'Kochi', state: 'Kerala' },
      { id: 'city-2', name: 'Kochi Metro', state: 'Kerala' },
    ];

    const mockQueryService: Partial<ITheatreQueryService> = {
      listCities: vi.fn().mockResolvedValue(mockCities),
    };

    const useCase = new ListCitiesUseCase(mockQueryService as ITheatreQueryService);
    const result = await useCase.execute();

    expect(mockQueryService.listCities).toHaveBeenCalledOnce();
    expect(result).toEqual(mockCities);
  });
});

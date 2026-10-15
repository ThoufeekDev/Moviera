import { describe, it, expect, vi } from 'vitest';
import { ListCitiesController } from './ListCitiesController';
import { ListCitiesUseCase } from '../../application/queries/ListCitiesUseCase';
import { CityOption } from '../../application/read-models/CityOption';

describe('ListCitiesController', () => {
  it('should return 200 with cities list', async () => {
    const mockCities: CityOption[] = [
      { id: 'c-1', name: 'Aurangabad', state: 'Bihar' },
      { id: 'c-2', name: 'Aurangabad', state: 'Maharashtra' },
      { id: 'c-3', name: 'Kochi', state: 'Kerala' },
    ];

    const mockUseCase = {
      execute: vi.fn().mockResolvedValue(mockCities),
    } as unknown as ListCitiesUseCase;

    const controller = new ListCitiesController(mockUseCase);
    const response = await controller.handle({} as any);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: mockCities,
    });
    expect(mockUseCase.execute).toHaveBeenCalledOnce();
  });
});

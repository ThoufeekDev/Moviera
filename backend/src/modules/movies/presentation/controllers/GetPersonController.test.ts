import { describe, it, expect, vi } from 'vitest';
import { GetPersonController } from './GetPersonController';
import { GetPersonsUseCase } from '../../application/queries/GetPersonUseCase';
import { Person } from '../../domain/entities/Person';

describe('GetPersonController', () => {
  it('should return 200 and list of people in framework-agnostic HttpResponse', async () => {
    const mockUseCase = {
      execute: vi.fn().mockResolvedValue([
        new Person('p-1', 'Christopher Nolan', 'https://example.com/nolan.jpg', 'img-1'),
      ]),
    } as unknown as GetPersonsUseCase;

    const controller = new GetPersonController(mockUseCase);

    const response = await controller.handle({
      params: undefined,
      body: undefined,
      query: undefined,
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('People fetched successfully');
    const data = response.body.data as Person[];
    expect(data).toHaveLength(1);
    expect(data[0].name).toBe('Christopher Nolan');
  });
});

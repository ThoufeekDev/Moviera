import { describe, it, expect, vi } from 'vitest';
import { LoginController } from './LoginController';
import { LoginUserUseCase } from '../../application/commands/LoginUserUseCase';
import { Role } from '../../../../shared/enums/Role';

describe('LoginController', () => {
  it('should login user successfully and return cookies in framework-agnostic response', async () => {
    const mockUseCase = {
      execute: vi.fn().mockResolvedValue({
        user: {
          id: 'user-id-123',
          name: 'John',
          email: 'john@example.com',
          role: Role.USER,
        },
      }),
    } as unknown as LoginUserUseCase;

    const controller = new LoginController(mockUseCase);

    const response = await controller.handle({
      params: undefined,
      query: undefined,
      body: {
        email: 'john@example.com',
        password: 'correct-password',
        role: Role.USER,
      },
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data?.email).toBe('john@example.com');
    expect(response.cookies).toBeDefined();
    expect(response.cookies).toHaveLength(2);
  });
});

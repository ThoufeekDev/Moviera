import { describe, it, expect, vi } from 'vitest';
import app from '../../../../app';
import request from 'supertest';
import { Role } from '../../../../shared/enums/Role';
import { makeLoginUserCase } from '../../infrastructure/factories/makeLoginUserCase';

vi.mock('../../infrastructure/factories/makeLoginUserCase', () => ({
  makeLoginUserCase: vi.fn(),
}));

describe('AuthController - Login', () => {
  it('should login user succesfully', async () => {
    vi.mocked(makeLoginUserCase).mockReturnValue({
      execute: vi.fn().mockResolvedValue({
        user: {
          id: 'user-id-123',
          name: 'John',
          email: 'john@example.com',
          role: Role.USER,
        },
      }),
    } as any);

    const response = await request(app).post('/auth/login').send({
      email: 'john@example.com',
      password: 'correct-password',
      role: Role.USER,
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.user.email).toBe('john@example.com');
    expect(response.header['set-cookie']).toBeDefined();
  });
});

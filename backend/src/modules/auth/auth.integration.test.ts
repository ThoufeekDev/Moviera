import request from 'supertest';
import app from '../../app';

import { describe, it, expect } from 'vitest';

describe('Auth Module', () => {
  it('should respond to an invalid auth endpoint', async () => {
    const response = await request(app).get('/auth/something-that-does-not-exist');

    expect(response.status).toBe(404);
  });

  it('should reject unauthenticated access to profile', async () => {
    const response = await request(app).get('/auth/profile');

    expect(response.status).toBe(401);
  });
});

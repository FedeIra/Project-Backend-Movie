import fastify, { FastifyInstance } from 'fastify';
import request from 'supertest';
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { loginHandler } from '../../server/handlers/loginUserHandler.js';
import { LoginUserUseCase } from '../../src/useCases/users/loginUserUseCase.js';
import { setupErrorHandler } from '../../server/errors.js';

// Same handler covered by getMoviesHandler.test.ts/registerUserHandler.test.ts
// via fastify.inject(); this one goes over a real HTTP socket with
// Supertest instead, to exercise the app the way an actual client would.

describe('POST /login-user (supertest)', () => {
  let server: FastifyInstance;
  const loginUser = vi.fn();

  beforeAll(async () => {
    server = fastify();
    loginHandler(server, { loginUser } as unknown as LoginUserUseCase);
    setupErrorHandler(server);
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  beforeEach(() => {
    loginUser.mockReset();
  });

  it('logs a user in and returns the use case result', async () => {
    const loggedUser = {
      username: 'federico',
      email: 'federico@example.com',
      wishList: [],
      token: 'jwt-token',
    };
    loginUser.mockResolvedValueOnce(loggedUser);

    const response = await request(server.server)
      .post('/login-user')
      .send({ username: 'federico', password: 'super-secret' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(loggedUser);
    expect(loginUser).toHaveBeenCalledWith({
      username: 'federico',
      password: 'super-secret',
    });
  });

  it('returns a 400 when the body is missing required fields', async () => {
    const response = await request(server.server)
      .post('/login-user')
      .send({ username: 'federico' });

    expect(response.status).toBe(400);
    expect(loginUser).not.toHaveBeenCalled();
  });
});

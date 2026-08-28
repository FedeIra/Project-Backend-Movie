import fastify, { FastifyInstance } from 'fastify';
import { describe, expect, it, vi } from 'vitest';

import { registerUserHandler } from '../../server/handlers/registerUserHandler.js';
import { RegisterUserUseCase } from '../../src/useCases/users/registerUserUseCase.js';
import { setupErrorHandler } from '../../server/errors.js';
import { ClientError } from '../../packages/errors/clientError.js';

const buildServer = (
  registerUserUseCase: RegisterUserUseCase
): FastifyInstance => {
  const server = fastify();
  registerUserHandler(server, registerUserUseCase);
  setupErrorHandler(server);
  return server;
};

describe('POST /register-user', () => {
  it('registers a user and returns the created user', async () => {
    const registeredUser = {
      username: 'federico',
      email: 'federico@example.com',
      wishList: [],
      createdAt: '2024-06-08T19:09:10.488Z',
    };
    const registerUser = vi.fn().mockResolvedValue(registeredUser);
    const server = buildServer({
      registerUser,
    } as unknown as RegisterUserUseCase);

    const response = await server.inject({
      method: 'POST',
      url: '/register-user',
      payload: {
        username: 'federico',
        password: 'super-secret',
        email: 'federico@example.com',
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(registeredUser);
  });

  it('rejects a body with unknown fields', async () => {
    const registerUser = vi.fn();
    const server = buildServer({
      registerUser,
    } as unknown as RegisterUserUseCase);

    const response = await server.inject({
      method: 'POST',
      url: '/register-user',
      payload: {
        username: 'federico',
        password: 'super-secret',
        email: 'federico@example.com',
        isAdmin: true,
      },
    });

    expect(response.statusCode).toBe(400);
    expect(registerUser).not.toHaveBeenCalled();
  });

  it('surfaces a duplicate-user error as a 400 without leaking internals', async () => {
    process.env.NODE_ENV = 'production';
    const registerUser = vi
      .fn()
      .mockRejectedValue(new ClientError('Username already exists'));
    const server = buildServer({
      registerUser,
    } as unknown as RegisterUserUseCase);

    const response = await server.inject({
      method: 'POST',
      url: '/register-user',
      payload: {
        username: 'federico',
        password: 'super-secret',
        email: 'federico@example.com',
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      errorCode: 400,
      error: 'Username already exists',
    });

    process.env.NODE_ENV = undefined;
  });
});

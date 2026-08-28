import fastify, { FastifyInstance } from 'fastify';
import { afterEach, describe, expect, it } from 'vitest';
import { z } from 'zod';

import { setupErrorHandler } from '../server/errors.js';
import { ClientError } from '../packages/errors/clientError.js';

// Security regression test: server/errors.ts used to send error.message and
// error.stack (and any CustomError details) back to the client in every
// environment, including production. This suite locks in the fix.

const buildServer = (): FastifyInstance => {
  const server = fastify();

  server.get('/boom', async () => {
    throw new Error('Something exploded internally at /very/secret/path.ts');
  });

  server.get('/client-error', async () => {
    throw new ClientError('Content already in wishlist.', {
      secret: 'internal-detail',
    });
  });

  server.get('/bad-request', async () => {
    z.object({ name: z.string() }).parse({});
    return {};
  });

  setupErrorHandler(server);
  return server;
};

describe('setupErrorHandler', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('omits errorDetails entirely in production for unexpected errors', async () => {
    process.env.NODE_ENV = 'production';
    const server = buildServer();

    const response = await server.inject({ method: 'GET', url: '/boom' });

    expect(response.json()).toEqual({
      errorCode: 500,
      error: 'Internal server error.',
    });
  });

  it('includes debugging details for unexpected errors outside production', async () => {
    process.env.NODE_ENV = 'development';
    const server = buildServer();

    const response = await server.inject({ method: 'GET', url: '/boom' });

    const body = response.json();
    expect(body.errorDetails.message).toBe(
      'Something exploded internally at /very/secret/path.ts'
    );
    expect(typeof body.errorDetails.stack).toBe('string');
  });

  it('omits CustomError details in production too', async () => {
    process.env.NODE_ENV = 'production';
    const server = buildServer();

    const response = await server.inject({
      method: 'GET',
      url: '/client-error',
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      errorCode: 400,
      error: 'Content already in wishlist.',
    });
  });

  it('includes CustomError details outside production', async () => {
    process.env.NODE_ENV = 'development';
    const server = buildServer();

    const response = await server.inject({
      method: 'GET',
      url: '/client-error',
    });

    expect(response.json().errorDetails).toEqual({
      secret: 'internal-detail',
    });
  });

  it('formats Zod validation errors as a 400 regardless of environment', async () => {
    process.env.NODE_ENV = 'production';
    const server = buildServer();

    const response = await server.inject({
      method: 'GET',
      url: '/bad-request',
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      errorCode: 400,
      error: 'Bad request.',
      validationErrors: [{ path: 'name', message: 'Required' }],
    });
  });
});

import fastify, { FastifyInstance } from 'fastify';
import { describe, expect, it, vi } from 'vitest';

import { getMoviesHandler } from '../../server/handlers/getMoviesHandler.js';
import { GetMoviesUseCase } from '../../src/useCases/movies/getMoviesUseCase.js';
import { setupErrorHandler } from '../../server/errors.js';

const buildServer = (getMoviesUseCase: GetMoviesUseCase): FastifyInstance => {
  const server = fastify();
  getMoviesHandler(server, getMoviesUseCase);
  setupErrorHandler(server);
  return server;
};

describe('POST /movies', () => {
  it('maps the request body to the use case payload and returns its result', async () => {
    const movies = [{ id: 1, title: 'Example' }];
    const getMovies = vi.fn().mockResolvedValue(movies);
    const server = buildServer({ getMovies } as unknown as GetMoviesUseCase);

    const response = await server.inject({
      method: 'POST',
      url: '/movies',
      payload: {
        filters: { genre: 'Action', recommended: true, year: 2024 },
        sorts: { byDate: true, byAverage: false },
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(movies);
    expect(getMovies).toHaveBeenCalledWith({
      filters: { genre: 'Action', recommended: true, year: 2024 },
      sorts: { byDate: true, byAverage: false },
    });
  });

  it('defaults optional filters/sorts when the body omits them', async () => {
    const getMovies = vi.fn().mockResolvedValue([]);
    const server = buildServer({ getMovies } as unknown as GetMoviesUseCase);

    await server.inject({ method: 'POST', url: '/movies', payload: {} });

    expect(getMovies).toHaveBeenCalledWith({
      filters: { genre: '', recommended: false, year: 0 },
      sorts: { byDate: false, byAverage: false },
    });
  });

  it('returns a 400 for an invalid request body', async () => {
    const getMovies = vi.fn();
    const server = buildServer({ getMovies } as unknown as GetMoviesUseCase);

    const response = await server.inject({
      method: 'POST',
      url: '/movies',
      payload: { filters: { year: 'not-a-number' } },
    });

    expect(response.statusCode).toBe(400);
    expect(getMovies).not.toHaveBeenCalled();
  });
});

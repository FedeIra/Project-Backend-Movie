// Import external packages:
import { FastifyInstance } from 'fastify';
import { z } from 'zod';

// Import internal packages:
import { GetMoviesUseCase } from '../../src/useCases/movies/getMovies.js';
import { Movie } from '../../src/models/movies.js';

// 1) Define request body schema:
const requestBodySchema = z
  .object({
    genre: z.string().optional(),
  })
  .strict();

export const getMoviesHandler = (
  fastifyServer: FastifyInstance,
  getMoviesUseCase: GetMoviesUseCase
): void => {
  fastifyServer.post(`/movies`, async (request, response) => {
    try {
      // 2) Validate request body:
      const payload = requestBodySchema.parse(request.body);
      // 3) Convert request body to use case payload:
      const useCasePayload = toUseCasePayload(payload);
      // 4) Call use case:
      const movies: Movie[] = await getMoviesUseCase.getMovies(useCasePayload);

      return response.status(200).send(movies);
    } catch (error) {
      throw error;
    }
  });
};

// Request body to use case payload conversion function:
const toUseCasePayload = (payload: any): any => {
  return {
    genre: payload.genre,
  };
};

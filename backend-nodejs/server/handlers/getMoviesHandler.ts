// Import external packages:
import { FastifyInstance } from 'fastify';
import { z } from 'zod';

// Import internal packages:
import { GetMoviesUseCase } from '../../src/useCases/movies/getMovies.js';
import { Movie } from '../../src/models/movies.js';

const requestBodySchema = z
  .object({
    genre: z.string().optional(),
  })
  .strict();

export function getMoviesHandler(
  server: FastifyInstance,
  getMoviesUseCase: GetMoviesUseCase
): void {
  server.post(`/movies`, async (request, response) => {
    try {
      requestBodySchema.parse(request.body);

      const movies: Movie[] = await getMoviesUseCase.getMovies(request.body);

      return response.status(200).send(movies);
    } catch (error) {
      console.error(error);
      response.status(500).send({ error: 'Internal Server Error' });
    }
  });
}

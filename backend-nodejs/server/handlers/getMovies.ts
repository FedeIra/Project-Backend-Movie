import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { TmdbClient } from '../../packages/clients/tmdbClient/tmdbClient.js';

import { TMDBMoviesService } from '../../src/services/movies/getMoviesService.js';
import { GetMoviesUseCase } from '../../src/useCases/movies/getMovies.js';

const requestBodySchema = z
  .object({
    genre: z.string().optional(),
  })
  .strict();

export function getMoviesHandler(server: FastifyInstance): any {
  server.post(`/movies`, async (request, response) => {
    try {
      console.log(JSON.stringify(request.body));

      requestBodySchema.parse(request.body);

      const tmdbClient = new TmdbClient();

      const movieService = new TMDBMoviesService(tmdbClient);

      const getMoviesUseCase = new GetMoviesUseCase(movieService);

      const movies = await getMoviesUseCase.getMovies(request.body);

      console.info('🚀 ~ server.post ~ movies:', movies);

      response.send(movies);
    } catch (error) {
      console.error(error);
      response.status(500).send({ error: 'Internal Server Error' });
    }
  });
}

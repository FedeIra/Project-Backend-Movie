import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { TmdbClient } from '../../packages/clients/tmdbClient/tmdbClient.js';

import { TMDBMoviesService } from '../../src/services/movies/getMoviesService.js';
// import { GetGenresUseCase } from '../../src/useCases/rawgApiCases/genres.js';

const requestBodySchema = z
  .object({
    genre: z.string().optional(),
  })
  .strict();

export function getMoviesHandler(server: FastifyInstance) {
  server.post(`/movies`, async (request, response) => {
    try {
      console.log(JSON.stringify(request.body));

      requestBodySchema.parse(request.body);

      const tmdbClient = new TmdbClient();

      const movieService = new TMDBMoviesService(tmdbClient);

      // const getGenresUseCase = new GetGenresUseCase(videogamesService);

      // const genres = await getGenresUseCase.getGenres();
      response.send({ message: 'Movie handler works!' });
    } catch (error) {
      console.error(error);
      response.status(500).send({ error: 'Internal Server Error' });
    }
  });
}

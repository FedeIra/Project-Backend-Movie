import { FastifyInstance } from 'fastify';
// import { RawgApiClient } from '../../pkg/rawgApiClient/rawgApiClient.js';
// import { z } from 'zod';

// import config from '../../pkg/env/config.js';
// import { RawgVideogamesService } from '../../src/services/rawgVideogames/videogamesService.js';
// import { GetGenresUseCase } from '../../src/useCases/rawgApiCases/genres.js';

// const requestBodySchema = z.object({}).strict();

export function getMoviesHandler(server: FastifyInstance) {
  server.post(`/movies`, async (request, response) => {
    try {
      console.info(`ESTOY ACA `);
      response.send({ message: 'Movie handler works!' });
      // requestBodySchema.parse(request.body);

      // const baseUrl = config.rawgApiBaseUrl || '';

      // const rawgClient = new RawgApiClient({ baseUrl });

      // const videogamesService = new RawgVideogamesService(rawgClient);

      // const getGenresUseCase = new GetGenresUseCase(videogamesService);

      // const genres = await getGenresUseCase.getGenres();
      response.send({ message: 'Movie handler works!' });
    } catch (error) {
      console.error(error);
      response.status(500).send({ error: 'Internal Server Error' });
    }
  });
}

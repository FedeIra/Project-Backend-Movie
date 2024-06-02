// External packages:
import { FastifyInstance } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';

// Internal packages:
import { getMoviesHandler } from './getMoviesHandler.js';
import { TmdbClient } from '../../packages/clients/tmdbClient/tmdbClient.js';
import { TMDBMoviesService } from '../../src/services/tmdb/movies/getMoviesService.js';
import { GetMoviesUseCase } from '../../src/useCases/movies/getMovies.js';

type Dependencies = {
  tmdbClient: TmdbClient;
  tmdbMoviesService: TMDBMoviesService;
  getMoviesUseCase: GetMoviesUseCase;
};

export const moviesHandlers = (
  server: FastifyInstance<Server, IncomingMessage, ServerResponse>,
  dependencies: Dependencies
): void => {
  const { getMoviesUseCase } = dependencies;

  getMoviesHandler(server, getMoviesUseCase);
};

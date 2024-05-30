import { FastifyInstance } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';

import { getMoviesHandler } from './getMovies.js';

export const moviesAndShowHandlers = (
  server: FastifyInstance<Server, IncomingMessage, ServerResponse>
) => {
  getMoviesHandler(server);
};

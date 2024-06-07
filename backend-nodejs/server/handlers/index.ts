// External packages:
import { FastifyInstance } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';

// Internal modules:
import { TmdbClient } from '../../packages/clients/tmdbClient/tmdbClient.js';
import { TMDBMoviesService } from '../../src/services/movies/getMoviesService.js';
import { DatabaseClient } from '../../packages/clients/dataBaseClient/databaseClient.js';
import { DataBaseServices } from '../../src/services/users/userService.js';
import { getMoviesHandler } from './getMoviesHandler.js';
import { GetMoviesUseCase } from '../../src/useCases/movies/getMoviesUseCase.js';
import { registerUserHandler } from './registerUser.js';
import { RegisterUserUseCase } from '../../src/useCases/users/registerUserUserCase.js';

// Define dependencies for movies handlers:
type MovieDependencies = {
  tmdbClient: TmdbClient;
  tmdbMoviesService: TMDBMoviesService;
  getMoviesUseCase: GetMoviesUseCase;
};

// Define dependencies for users handlers:
type UserDependencies = {
  databaseClient: DatabaseClient;
  dataBaseServices: DataBaseServices;
  registerUserUseCase: RegisterUserUseCase;
};

// Define movies handlers:
export const moviesHandlers = (
  server: FastifyInstance<Server, IncomingMessage, ServerResponse>,
  dependencies: MovieDependencies
): void => {
  getMoviesHandler(server, dependencies.getMoviesUseCase);
};

// Define users handlers:
export const usersHandlers = (
  server: FastifyInstance<Server, IncomingMessage, ServerResponse>,
  dependencies: UserDependencies
): void => {
  registerUserHandler(server, dependencies.registerUserUseCase);
};

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
import { registerUserHandler } from './registerUserHandler.js';
import { RegisterUserUseCase } from '../../src/useCases/users/registerUserUseCase.js';
import { loginHandler } from './loginUserHandler.js';
import { LoginUserUseCase } from '../../src/useCases/users/loginUserUseCase.js';

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
  loginUserUseCase: LoginUserUseCase;
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
  loginHandler(server, dependencies.loginUserUseCase);
};

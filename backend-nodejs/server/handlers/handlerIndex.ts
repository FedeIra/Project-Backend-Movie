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
import { refreshTokenHandler } from './refreshTokenHandler.js';
import { RefreshTokenUseCase } from '../../src/useCases/users/refreshTokenUseCase.js';
import { TMDBTvShowService } from '../../src/services/tvShows/getTvshowDetailsService.js';
import { GetTvshowDetailsUseCase } from '../../src/useCases/tvShows/getTvshowsDetaillsUseCase.js';
import { getTvshowDetailsHandler } from './getTvshowDetailsHandler.js';
import { addToWishlistHandler } from './addToWishlistHandler.js';
import { AddToWishlistUseCase } from '../../src/useCases/users/addToWishlistUseCase.js';

// Define dependencies for movies handler:
type MovieDependencies = {
  tmdbClient: TmdbClient;
  tmdbMoviesService: TMDBMoviesService;
  getMoviesUseCase: GetMoviesUseCase;
};

// Define dependencies for tv show details handler:
type TvShowDetailsDependencies = {
  tmdbClient: TmdbClient;
  tmdbTvShowService: TMDBTvShowService;
  getTvshowDetailsUseCase: GetTvshowDetailsUseCase;
};

// Define dependencies for users handlers:
type UserDependencies = {
  databaseClient: DatabaseClient;
  dataBaseServices: DataBaseServices;
  registerUserUseCase: RegisterUserUseCase;
  loginUserUseCase: LoginUserUseCase;
  refreshTokenUseCase: RefreshTokenUseCase;
  addToWishlistUseCase: AddToWishlistUseCase;
};

// Define movies handler:
export const moviesHandlers = (
  server: FastifyInstance<Server, IncomingMessage, ServerResponse>,
  dependencies: MovieDependencies
): void => {
  getMoviesHandler(server, dependencies.getMoviesUseCase);
};

// Define tv show details handler:
export const tvShowDetailsHandlers = (
  server: FastifyInstance<Server, IncomingMessage, ServerResponse>,
  dependencies: TvShowDetailsDependencies
): void => {
  getTvshowDetailsHandler(server, dependencies.getTvshowDetailsUseCase);
};

// Define users handlers:
export const usersHandlers = (
  server: FastifyInstance<Server, IncomingMessage, ServerResponse>,
  dependencies: UserDependencies
): void => {
  registerUserHandler(server, dependencies.registerUserUseCase);
  loginHandler(server, dependencies.loginUserUseCase);
  refreshTokenHandler(server, dependencies.refreshTokenUseCase);
  addToWishlistHandler(server, dependencies.addToWishlistUseCase);
};

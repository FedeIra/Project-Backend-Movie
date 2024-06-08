// external packages:
import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';

// internal packages:
import config from '../packages/env/config.js';
import { TmdbClient } from '../packages/clients/tmdbClient/tmdbClient.js';
import { TMDBMoviesService } from '../src/services/movies/getMoviesService.js';
import { GetMoviesUseCase } from '../src/useCases/movies/getMoviesUseCase.js';
import {
  moviesHandlers,
  tvShowDetailsHandlers,
  usersHandlers,
} from './handlers/handlerIndex.js';
import { DatabaseClient } from '../packages/clients/dataBaseClient/databaseClient.js';
import { DataBaseServices } from '../src/services/users/userService.js';
import { RegisterUserUseCase } from '../src/useCases/users/registerUserUseCase.js';
import { LoginUserUseCase } from '../src/useCases/users/loginUserUseCase.js';
import { RefreshTokenUseCase } from '../src/useCases/users/refreshTokenUseCase.js';
import { setupErrorHandler } from './errors.js';
import { TMDBTvShowService } from '../src/services/tvShows/getTvshowDetailsService.js';
import { GetTvshowDetailsUseCase } from '../src/useCases/tvShows/getTvshowsDetaillsUseCase.js';
import { AddToWishlistUseCase } from '../src/useCases/users/addToWishlistUseCase.js';
import { UnauthorizedError } from '../packages/errors/unauthorizedError.js';

// Fastify server configuration:
const fastifyServerConfig = {
  port: Number(config.port) || 3001,
  host: config.host || '0.0.0.0',
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
};

// Fastify server builder:
const buildServer = (): FastifyInstance => {
  const fastifyServer: FastifyInstance = fastify();
  fastifyServer.register(cors, fastifyServerConfig.cors);
  fastifyServer.register(fastifyJwt, {
    secret: config.jwtSecret ?? 'add-your-jwt-secret-in-env-file',
  });
  // Middleware for authentication with jwt
  fastifyServer.decorate(
    'authenticate',
    async function (
      request: { jwtVerify: () => any },
      reply: { send: (arg0: unknown) => void }
    ) {
      try {
        await request.jwtVerify();
      } catch (error) {
        reply.send(new UnauthorizedError('Unauthorized access', error));
      }
    }
  );
  return fastifyServer;
};

// Build and initiate fastify server:
const fastifyServer = buildServer();

// Dependencies injection:
const tmdbClient = new TmdbClient();
const tmdbMoviesService = new TMDBMoviesService(tmdbClient);
const tmdbTvShowService = new TMDBTvShowService(tmdbClient);
const databaseClient = new DatabaseClient();
const dataBaseServices = new DataBaseServices(fastifyServer);
const getMoviesUseCase = new GetMoviesUseCase(tmdbMoviesService);
const getTvshowDetailsUseCase = new GetTvshowDetailsUseCase(tmdbTvShowService);
const registerUserUseCase = new RegisterUserUseCase(dataBaseServices);
const loginUserUseCase = new LoginUserUseCase(dataBaseServices);
const refreshTokenUseCase = new RefreshTokenUseCase(dataBaseServices);
const addToWishlistUseCase = new AddToWishlistUseCase(dataBaseServices);

// Handlers setup:
moviesHandlers(fastifyServer, {
  tmdbClient,
  tmdbMoviesService,
  getMoviesUseCase,
});

tvShowDetailsHandlers(fastifyServer, {
  tmdbClient,
  tmdbTvShowService,
  getTvshowDetailsUseCase,
});

usersHandlers(fastifyServer, {
  databaseClient,
  dataBaseServices,
  registerUserUseCase,
  loginUserUseCase,
  refreshTokenUseCase,
  addToWishlistUseCase,
});

setupErrorHandler(fastifyServer);

// Fastify server initiation:
const startServer = async (fastifyServer: FastifyInstance): Promise<void> => {
  try {
    await databaseClient.connect();
    await fastifyServer.listen({
      port: fastifyServerConfig.port,
      host: fastifyServerConfig.host,
    });
    console.log(`Listening at http://localhost:${fastifyServerConfig.port}.`);
  } catch (err) {
    console.error(`Error starting server. More details as follows: ${err}`);
    process.exit(1);
  }
};

// Start server:
startServer(fastifyServer);

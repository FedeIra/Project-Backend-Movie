// external packages:
import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';

// internal packages:
import config from '../packages/env/config.js';
import { TmdbClient } from '../packages/clients/tmdbClient/tmdbClient.js';
import { TMDBMoviesService } from '../src/services/movies/getMoviesService.js';
import { GetMoviesUseCase } from '../src/useCases/movies/getMovies.js';
import { moviesHandlers, usersHandlers } from './handlers/index.js';
import { setupErrorHandler } from './errors.js';
import { DatabaseClient } from '../packages/clients/dataBaseClient/databaseClient.js';
import { DataBaseServices } from '../src/services/users/userService.js';
import { RegisterUserUseCase } from '../src/useCases/users/registerUser.js';

// Dependencies injection:
const tmdbClient = new TmdbClient();
const tmdbMoviesService = new TMDBMoviesService(tmdbClient);
const databaseClient = new DatabaseClient();
const dataBaseServices = new DataBaseServices();
const getMoviesUseCase = new GetMoviesUseCase(tmdbMoviesService);
const registerUserUseCase = new RegisterUserUseCase(dataBaseServices);

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
  return fastifyServer;
};

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

// Build and initiate fastify server:
const fastifyServer = buildServer();

moviesHandlers(fastifyServer, {
  tmdbClient,
  tmdbMoviesService,
  getMoviesUseCase,
});

usersHandlers(fastifyServer, {
  databaseClient,
  dataBaseServices,
  registerUserUseCase,
});

setupErrorHandler(fastifyServer);

startServer(fastifyServer);

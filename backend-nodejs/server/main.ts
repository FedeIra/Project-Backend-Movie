// external packages:
import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';

// internal packages:
import config from '../packages/env/config.js';
import { TmdbClient } from '../packages/clients/tmdbClient/tmdbClient.js';
import { TMDBMoviesService } from '../src/services/tmdb/movies/getMoviesService.js';
import { GetMoviesUseCase } from '../src/useCases/movies/getMovies.js';
import { moviesHandlers } from './handlers/index.js';
import { setupErrorHandler } from './errors.js';

// Dependency injection:
const tmdbClient = new TmdbClient();
const tmdbMoviesService = new TMDBMoviesService(tmdbClient);
const getMoviesUseCase = new GetMoviesUseCase(tmdbMoviesService);

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
    await fastifyServer.listen({
      port: fastifyServerConfig.port,
      host: fastifyServerConfig.host,
    });
    console.log(`Listening at http://localhost:${fastifyServerConfig.port}`);
  } catch (err) {
    console.error(`Error starting server: ${err}`);
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

setupErrorHandler(fastifyServer);

startServer(fastifyServer);

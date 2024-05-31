// external packages:
import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';

// internal packages:
import config from '../packages/env/config.js';
import { moviesAndShowHandlers } from './handlers/index.js';

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
const startServer = async (fastifyServer: FastifyInstance) => {
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

moviesAndShowHandlers(fastifyServer);

startServer(fastifyServer);

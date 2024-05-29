import fastify from 'fastify';
import cors from '@fastify/cors';

import config from '../packages/env/config.js';

const fastifyServer = fastify();
const port = Number(config.port) || 3001;
const host = config.host || '0.0.0.0';

fastifyServer.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});

const startServer = async () => {
  try {
    await fastifyServer.listen({
      port,
      host,
    });
    console.log(`Listening at http://localhost:${port}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const start = async () => {
  await startServer();
};

start();

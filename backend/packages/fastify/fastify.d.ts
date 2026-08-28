import { FastifyInstance } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: any;
  }
}

// external packages:
import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifyMultipart from '@fastify/multipart';

// internal packages:
import config from '../packages/env/config.js';
import { TmdbClient } from '../packages/clients/tmdbClient/tmdbClient.js';
import { TMDBMoviesService } from '../src/services/movies/getMoviesService.js';
import { GetMoviesUseCase } from '../src/useCases/movies/getMoviesUseCase.js';
import {
  moviesHandlers,
  tvShowDetailsHandlers,
  usersHandlers,
  filesHandlers,
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
import { S3ServiceImpl } from '../src/services/files/awsS3Services.js';
import { GetFilesListUseCase } from '../src/useCases/files/getListFilesUseCase.js';
import { GetFileUseCase } from '../src/useCases/files/getFileUseCase.js';
import { UploadFileUseCase } from '../src/useCases/files/uploadFileUseCase.js';
import { DeleteFileUseCase } from '../src/useCases/files/deleteFileUseCase.js';
import { GetFileUrlUseCase } from '../src/useCases/files/getUrlFileUseCase.js';

// Fastify server configuration:
const fastifyServerConfig = {
  port: config.port,
  host: config.host,
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
    secret: config.jwtSecret as string,
  });
  // Register the multipart plugin
  fastifyServer.register(fastifyMultipart, {
    attachFieldsToBody: true,
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
const awsS3Service = new S3ServiceImpl();
const getFilesListUseCase = new GetFilesListUseCase(awsS3Service);
const getFileUseCase = new GetFileUseCase(awsS3Service);
const uploadFileUseCase = new UploadFileUseCase(awsS3Service);
const deleteFileUseCase = new DeleteFileUseCase(awsS3Service);
const getFileUrlUseCase = new GetFileUrlUseCase(awsS3Service);

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

filesHandlers(fastifyServer, {
  awsS3Service,
  getFilesListUseCase,
  getFileUseCase,
  uploadFileUseCase,
  deleteFileUseCase,
  getFileUrlUseCase,
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

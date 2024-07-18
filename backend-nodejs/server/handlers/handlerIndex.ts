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
import { GetFilesListUseCase } from '../../src/useCases/files/getListFilesUseCase.js';
import { AwsS3Service } from '../../src/services/files/awsS3Services.js';
import { getFilesListHandler } from './getFilesListHandler.js';
import { getFileHandler } from './getFileHandler.js';
import { GetFileUseCase } from '../../src/useCases/files/getFileUseCase.js';
import { uploadFileHandler } from './uploadFileHandler.js';
import { UploadFileUseCase } from '../../src/useCases/files/uploadFileUseCase.js';
import { deleteFileHandler } from './deleteFileHandler.js';
import { DeleteFileUseCase } from '../../src/useCases/files/deleteFileUseCase.js';
import { getFileUrlHandler } from './getFileUrlHandler.js';
import { GetFileUrlUseCase } from '../../src/useCases/files/getUrlFileUseCase.js';
import { CreateFileDocumentUseCase } from '../../src/useCases/database/createFileDocument.js';
import { createFileDocumentHandler } from './createFileDocumentHandler.js';
import { AwsDynamoDBService } from '../../src/services/files/awsDynamoDBServices.js';

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

// Define dependencies for files handler:
type FilesDependencies = {
  awsS3Service: AwsS3Service;
  getFilesListUseCase: GetFilesListUseCase;
  getFileUseCase: GetFileUseCase;
  uploadFileUseCase: UploadFileUseCase;
  deleteFileUseCase: DeleteFileUseCase;
  getFileUrlUseCase: GetFileUrlUseCase;
};

// Define dependencies for database documents handler:
type DocumentDependencies = {
  awsDynamoDBService: AwsDynamoDBService;
  awsS3Service: AwsS3Service;
  createFileDocumentUseCase: CreateFileDocumentUseCase;
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

// Define files handler:
export const filesHandlers = (
  server: FastifyInstance<Server, IncomingMessage, ServerResponse>,
  dependencies: FilesDependencies
): void => {
  getFilesListHandler(server, dependencies.getFilesListUseCase);
  getFileHandler(server, dependencies.getFileUseCase);
  uploadFileHandler(server, dependencies.uploadFileUseCase);
  deleteFileHandler(server, dependencies.deleteFileUseCase);
  getFileUrlHandler(server, dependencies.getFileUrlUseCase);
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

// Define documents handler:
export const documentHandlers = (
  server: FastifyInstance<Server, IncomingMessage, ServerResponse>,
  dependencies: DocumentDependencies
): void => {
  createFileDocumentHandler(server, dependencies.createFileDocumentUseCase);
};

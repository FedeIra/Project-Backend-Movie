// External packages:
import { FastifyInstance } from 'fastify';

// Internal modules:
import { GetFilesListUseCase } from '../../src/useCases/files/getListFilesUseCase.js';
// import { Movie } from '../../src/models/movies.js';

// Handler function:
export const getFilesHandler = (
  fastifyServer: FastifyInstance,
  getFilesUseCase: GetFilesListUseCase
): void => {
  fastifyServer.get(
    `/files`,
    { preValidation: [fastifyServer.authenticate] },
    async (request, response) => {
      try {
        // 1) Call use case:
        const files: any = await getFilesUseCase.getFiles();

        return response.status(200).send(files);
      } catch (error) {
        throw error;
      }
    }
  );
};

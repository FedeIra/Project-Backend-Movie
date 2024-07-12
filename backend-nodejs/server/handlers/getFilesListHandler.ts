// External packages:
import { FastifyInstance } from 'fastify';

// Internal modules:
import { GetFilesListUseCase } from '../../src/useCases/files/getListFilesUseCase.js';
import { FilesS3 } from '../../src/models/files.js';

// Handler function:
export const getFilesListHandler = (
  fastifyServer: FastifyInstance,
  getFilesUseCase: GetFilesListUseCase
): void => {
  fastifyServer.get(
    `/files-list`,
    { preValidation: [fastifyServer.authenticate] },
    async (request, response) => {
      try {
        // 1) Call use case:
        const files: FilesS3 = await getFilesUseCase.getFiles();

        return response.status(200).send(files);
      } catch (error) {
        throw error;
      }
    }
  );
};

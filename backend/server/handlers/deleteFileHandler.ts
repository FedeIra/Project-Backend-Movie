// External packages:
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

// Internal modules:
import { DeleteFileUseCase } from '../../src/useCases/files/deleteFileUseCase';
import { DeleteFileResponse } from '../../src/models/files';

// Handler function:
export const deleteFileHandler = (
  fastifyServer: FastifyInstance,
  deleteFileUseCase: DeleteFileUseCase
): void => {
  fastifyServer.delete(
    '/file/:keyName',
    { preValidation: [fastifyServer.authenticate] },
    async (
      request: FastifyRequest<{
        Params: { keyName: string };
      }>,
      response: FastifyReply
    ) => {
      // 1) Get file name from request:
      const keyName: string = request.params.keyName;

      // 2) Call use case:
      const deleteFileResponse: DeleteFileResponse =
        await deleteFileUseCase.deleteFile(keyName);

      return response.status(200).send(deleteFileResponse);
    }
  );
};

// External packages:
import { FastifyInstance, FastifyRequest } from 'fastify';

// Internal modules:
import { GetFileUrlUseCase } from '../../src/useCases/files/getUrlFileUseCase';
import { GetFileUrlResponse } from '../../src/models/files';

// Handler function:
export const getFileUrlHandler = (
  fastifyServer: FastifyInstance,
  getUrlFileUseCase: GetFileUrlUseCase
): void => {
  fastifyServer.get(
    `/fileUrl/:fileKey`,
    { preValidation: [fastifyServer.authenticate] },
    async (
      request: FastifyRequest<{
        Params: { fileKey: string };
      }>,
      response
    ) => {
      // 1) Get key file from request:
      const fileKey: string = request.params.fileKey;

      // 2) Call use case:
      const fileUrl: GetFileUrlResponse =
        await getUrlFileUseCase.getFileUrl(fileKey);

      return response.status(200).send(fileUrl);
    }
  );
};

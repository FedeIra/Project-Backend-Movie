// External packages:
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

// Internal modules:
import { CreateFileDocumentUseCase } from '../../src/useCases/database/createFileDocument';

// Handler function:
export const createFileDocumentHandler = (
  fastifyServer: FastifyInstance,
  createFileUseCase: CreateFileDocumentUseCase
): void => {
  fastifyServer.post(
    `/create-document/:fileKey`,
    { preValidation: [fastifyServer.authenticate] },
    async (
      request: FastifyRequest<{
        Params: { fileKey: string };
      }>,
      response: FastifyReply
    ) => {
      // 1) Get key file from request:
      const fileKey: string = request.params.fileKey;

      // 2) Call use case:
      const reponseDynamoDB: any =
        await createFileUseCase.createDocument(fileKey);

      return response.status(200).send(reponseDynamoDB);
    }
  );
};

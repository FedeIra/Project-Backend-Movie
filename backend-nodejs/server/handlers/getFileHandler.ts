// External packages:
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

// Internal modules:
import { GetFileUseCase } from '../../src/useCases/files/getFileUseCase';

// Handler function:
export const getFileHandler = (
  fastifyServer: FastifyInstance,
  getFileUseCase: GetFileUseCase
): void => {
  fastifyServer.get(
    `/file/:fileKey`,
    { preValidation: [fastifyServer.authenticate] },
    async (
      request: FastifyRequest<{
        Params: { fileKey: string };
      }>,
      response: FastifyReply
    ) => {
      try {
        // 1) Get key file from request:
        const fileKey: string = request.params.fileKey;

        // 2) Call use case:
        const file: Buffer = await getFileUseCase.getFile(fileKey);

        // 3) Send file as response:
        response.header('Content-Type', 'application/pdf');
        response.header(
          'Content-Disposition',
          `attachment; filename=${fileKey}`
        );

        return response.status(200).send(file);
      } catch (error) {
        throw error;
      }
    }
  );
};

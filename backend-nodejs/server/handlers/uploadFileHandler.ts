// External packages:
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

// Internal modules:
import { UploadFileUseCase } from '../../src/useCases/files/uploadFileUseCase';
import { MultipartFile } from '@fastify/multipart';
import { UploadFileResponse } from '../../src/models/files';

// Handler function:
export const uploadFileHandler = (
  fastifyServer: FastifyInstance,
  uploadFileUseCase: UploadFileUseCase
): void => {
  fastifyServer.post(
    '/file/:keyName',
    { preValidation: [fastifyServer.authenticate] },
    async (
      request: FastifyRequest<{
        Params: { keyName: string };
        Body: { file: MultipartFile };
      }>,
      response: FastifyReply
    ) => {
      try {
        // 1) Get file from request:
        const file: MultipartFile = request.body.file;

        // 2) Convert file to buffer:
        const fileBuffer = await file.toBuffer();

        // 3) Get file name from request:
        const keyName: string = request.params.keyName;

        // 4) Call use case:
        const responseUpload: UploadFileResponse =
          await uploadFileUseCase.uploadFile(fileBuffer, keyName);

        return response.status(200).send(responseUpload);
      } catch (error) {
        throw error;
      }
    }
  );
};

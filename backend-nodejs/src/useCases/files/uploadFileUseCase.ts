// Internal modules:
import { AwsS3Service } from '../../services/files/awsS3Services.js';
import { UploadFileResponse } from '../../models/files.js';

// Define use cases for getting S3 bucket file:
export class UploadFileUseCase {
  constructor(private filesService: AwsS3Service) {}

  // Use case for getting S3 bucket file:
  async uploadFile(file: Buffer, keyName: string): Promise<UploadFileResponse> {
    // 1) Upload file with service:
    const response: UploadFileResponse = await this.filesService.uploadFile(
      file,
      keyName
    );

    return response;
  }
}

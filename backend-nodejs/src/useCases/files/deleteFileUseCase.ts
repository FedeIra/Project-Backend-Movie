// Internal modules:
import { AwsS3Service } from '../../services/files/awsS3Services.js';
import { DeleteFileResponse } from '../../models/files.js';

// Define use cases for getting S3 bucket file:
export class DeleteFileUseCase {
  constructor(private filesService: AwsS3Service) {}

  // Use case for getting S3 bucket file:
  async deleteFile(fileKey: string): Promise<DeleteFileResponse> {
    // 1) Get file from service:
    const response: DeleteFileResponse =
      await this.filesService.deleteFile(fileKey);

    return response;
  }
}

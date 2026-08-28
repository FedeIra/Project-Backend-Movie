// Internal modules:
import { AwsS3Service } from '../../services/files/awsS3Services.js';
import { GetFileUrlResponse } from '../../models/files.js';

// Define use cases for getting S3 bucket file:
export class GetFileUrlUseCase {
  constructor(private filesService: AwsS3Service) {}

  // Use case for getting S3 bucket file:
  async getFileUrl(fileKey: string): Promise<GetFileUrlResponse> {
    // 1) Get file from service:
    const fileUrl: GetFileUrlResponse =
      await this.filesService.getFileUrl(fileKey);

    return fileUrl;
  }
}

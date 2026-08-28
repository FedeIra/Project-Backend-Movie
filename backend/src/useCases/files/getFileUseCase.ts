// Internal modules:
import { AwsS3Service } from '../../services/files/awsS3Services.js';

// Define use cases for getting S3 bucket file:
export class GetFileUseCase {
  constructor(private filesService: AwsS3Service) {}

  // Use case for getting S3 bucket file:
  async getFile(fileKey: string): Promise<Buffer> {
    // 1) Get file from service:
    const file: Buffer = await this.filesService.getFile(fileKey);

    return file;
  }
}

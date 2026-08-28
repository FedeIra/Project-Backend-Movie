// Internal modules:
import { AwsS3Service } from '../../services/files/awsS3Services.js';
import { FilesS3 } from '../../models/files.js';

// Define use cases for getting S3 bucket files list:
export class GetFilesListUseCase {
  constructor(private filesService: AwsS3Service) {}

  // Use case for getting S3 bucket files list:
  async getFiles(): Promise<FilesS3> {
    // 1) Get files list from service:
    const filesList: FilesS3 = await this.filesService.listFiles();

    return filesList;
  }
}

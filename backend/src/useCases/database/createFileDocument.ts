// External packages:
import { GetObjectOutput } from 'aws-sdk/clients/s3';

// Internal packages:
import { AwsDynamoDBService } from '../../services/files/awsDynamoDBServices';
import { AwsS3Service } from '../../services/files/awsS3Services';
import { GetFileUrlResponse } from '../../models/files';

// Define use cases for getting S3 bucket file:
export class CreateFileDocumentUseCase {
  constructor(
    private databaseService: AwsDynamoDBService,
    private filesService: AwsS3Service
  ) {}

  // Use case for creating document in DynamoDB:
  async createDocument(fileKey: any): Promise<any> {
    // 1) Get data from S3 bucket:
    const fileData: GetObjectOutput =
      await this.filesService.getFileData(fileKey);

    console.log(
      '🚀 ~ CreateFileDocumentUseCase ~ createDocument ~ fileData:',
      fileData
    );

    // 2) Get url from S3 bucket:
    const fileUrl: GetFileUrlResponse =
      await this.filesService.getFileUrl(fileKey);

    console.log(
      '🚀 ~ CreateFileDocumentUseCase ~ createDocument ~ fileUrl:',
      fileUrl
    );

    // 3) Create document:
    const document: any = {
      fileKey,
      fileData: fileData,
      fileUrl: fileUrl,
    };
    console.log(
      '🚀 ~ CreateFileDocumentUseCase ~ createDocument ~ document:',
      document
    );

    // 4) Create document in DynamoDB:
    const response: any = await this.databaseService.createDocument(document);
    console.log(
      '🚀 ~ CreateFileDocumentUseCase ~ createDocument ~ response:',
      response
    );

    return response;
  }
}

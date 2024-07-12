// Internal packages:
import { awsS3 } from '../../../packages/clients/awsClient/awsClient';
import { ListObjectsV2Output } from 'aws-sdk/clients/s3';
import config from '../../../packages/env/config';
import { FilesS3 } from '../../models/files';
import { ClientError } from '../../../packages/errors/clientError.js';

// Define service interface:
export interface AwsS3Service {
  listFiles(): Promise<FilesS3>;
}

// Define service class:
export class S3ServiceImpl implements AwsS3Service {
  // Method to list files in the bucket
  async listFiles(): Promise<FilesS3> {
    try {
      const params = {
        Bucket: config.aws.bucketName,
      };

      const files: ListObjectsV2Output = await awsS3
        .listObjectsV2(params)
        .promise();

      const filteredFiles: FilesS3 = this.mapAndFilterFiles(files);

      return filteredFiles;
    } catch (error) {
      throw new ClientError('Error listing AWS S3 files.', error);
    }
  }

  // Function to map and filter file data:
  private mapAndFilterFiles(files: ListObjectsV2Output): FilesS3 {
    const filteredData: FilesS3 = {
      bucketName: files.Name ?? 'No bucket name found.',
      totalFiles: files.KeyCount ?? 0,
      files:
        files.Contents?.map((file) => ({
          name: file.Key ?? '',
          lastUpdated: file.LastModified ?? new Date(),
          size: file.Size ?? 0,
        })) ?? [],
    };
    return filteredData;
  }
}

export default S3ServiceImpl;

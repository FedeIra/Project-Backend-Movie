// External packages:
// import { ZodError } from 'zod';

// Internal packages:
import { awsS3 } from '../../../packages/clients/awsClient/awsClient';
import { ListObjectsV2Output } from 'aws-sdk/clients/s3';
import config from '../../../packages/env/config';
// import { ClientError } from '../../../packages/errors/clientError.js';

// Define service interface:
export interface AwsS3Service {
  listFiles(): Promise<ListObjectsV2Output>;
}

// Define service class:
export class S3ServiceImpl implements AwsS3Service {
  // Method to list files in the bucket
  async listFiles(): Promise<ListObjectsV2Output> {
    const params = {
      Bucket: config.aws.bucketName,
    };

    const files: ListObjectsV2Output = await awsS3
      .listObjectsV2(params)
      .promise();

    return files;
  }
}

export default S3ServiceImpl;

// External packages:
import { ZodError } from 'zod';

// Internal packages:
import { awsS3 } from '../../../packages/clients/awsClient/awsClient';
import { ClientError } from '../../../packages/errors/clientError.js';

// Define service interface:
export interface AwsS3Service {
  listFiles(): Promise<AWS.S3.ListObjectsV2Output>;
}

// Define service class:
export class FilesService implements AwsS3Service {
  private bucketName: string;

  constructor(bucketName: string) {
    this.bucketName = bucketName;
  }

  // Method to list files in the bucket
  async listFiles(): Promise<AWS.S3.ListObjectsV2Output> {
    const params = {
      Bucket: this.bucketName,
    };

    return awsS3.listObjectsV2(params).promise();
  }
}

// class AwsS3Service {
//   private bucketName: string;

//   constructor(bucketName: string) {
//     this.bucketName = bucketName;
//   }

//   // Method to list files in the bucket
//   async listFiles(): Promise<AWS.S3.ListObjectsV2Output> {
//     const params = {
//       Bucket: this.bucketName,
//     };

//     return awsS3.listObjectsV2(params).promise();
//   }
// }

// export default AwsS3Service;

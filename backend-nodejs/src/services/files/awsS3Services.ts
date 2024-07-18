// External packages:
import { ListObjectsV2Output, GetObjectOutput } from 'aws-sdk/clients/s3';

// Internal packages:
import { awsS3 } from '../../../packages/clients/awsClient/awsClient';
import config from '../../../packages/env/config';

import { ClientError } from '../../../packages/errors/clientError.js';
import {
  FilesS3,
  UploadFileResponse,
  DeleteFileResponse,
  GetFileUrlResponse,
} from '../../models/files';
import {
  s3UploadResponse,
  s3UploadResponseSchema,
  toModeUploadFileResponse,
} from './entities/uploadFile';

import {
  s3DeleteResponseSchema,
  toModelDeleteFileResponse,
} from './entities/deleteFile';

// Define service interface:
export interface AwsS3Service {
  listFiles(): Promise<FilesS3>;
  getFileUrl(fileName: string): Promise<GetFileUrlResponse>;
  getFile(fileName: string): Promise<Buffer>;
  getFileData(fileName: string): Promise<GetObjectOutput>;
  uploadFile(
    file: Buffer,
    fileName: string,
    contentType: string
  ): Promise<UploadFileResponse>;
  deleteFile(fileName: string): Promise<DeleteFileResponse>;
}

// Define service class:
export class S3ServiceImpl implements AwsS3Service {
  // Service to list files in S3 bucket
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

  // Service to get url from S3 bucket:
  async getFileUrl(fileKey: string): Promise<GetFileUrlResponse> {
    try {
      // const params = {
      //   Bucket: config.aws.bucketName,
      //   Key: fileKey,
      // };

      // const url: string = awsS3.getSignedUrl('getObject', params);

      // const urlResponse = {
      //   url,
      // };

      // 1) S3 service to get file url:
      const urlResponse: GetFileUrlResponse = {
        url: `https://${config.aws.bucketName}.s3.${config.aws.region}.amazonaws.com/${fileKey}`.replace(
          /\s/g,
          '+'
        ),
      };

      return urlResponse;
    } catch (error) {
      throw new ClientError('AWS S3 service error.', error);
    }
  }

  // Service to get file from S3 bucket:
  async getFile(fileKey: string): Promise<Buffer> {
    try {
      const params = {
        Bucket: config.aws.bucketName,
        Key: fileKey,
      };

      const fileData: GetObjectOutput = await awsS3.getObject(params).promise();

      if (fileData.Body && Buffer.isBuffer(fileData.Body)) {
        return fileData.Body;
      } else {
        throw new ClientError('AWS files service incorrect response.');
      }
    } catch (error) {
      throw new ClientError('AWS S3 service error.', error);
    }
  }

  // Service to get file data from S3 bucket:
  async getFileData(fileKey: string): Promise<GetObjectOutput> {
    try {
      const params = {
        Bucket: config.aws.bucketName,
        Key: fileKey,
      };

      const fileData: GetObjectOutput = await awsS3.getObject(params).promise();

      return fileData;
    } catch (error) {
      throw new ClientError('AWS S3 service error.', error);
    }
  }

  // Service to upload file to S3 bucket:
  async uploadFile(
    file: Buffer,
    keyName: string,
    contentType: string
  ): Promise<UploadFileResponse> {
    try {
      if (
        !keyName.toLowerCase().endsWith('.pdf') &&
        contentType === 'application/pdf'
      ) {
        keyName += '.pdf';
      }

      const params = {
        Bucket: config.aws.bucketName,
        Key: keyName,
        Body: file,
        ACL: 'public-read',
        ContentType: contentType,
      };

      // 1) S3 service to upload file:
      const s3Response: s3UploadResponse = await awsS3.upload(params).promise();

      // 2) Validate response:
      s3UploadResponseSchema.parse(s3Response);

      // 3) Convert response to model
      const uploadFileResponse: UploadFileResponse =
        toModeUploadFileResponse(s3Response);

      return uploadFileResponse;
    } catch (error) {
      throw new ClientError('Error uploading file to AWS S3.', error);
    }
  }

  // Service to delete file from S3 bucket:
  async deleteFile(fileName: string): Promise<DeleteFileResponse> {
    try {
      const params = {
        Bucket: config.aws.bucketName,
        Key: fileName,
      };

      // 1) S3 service to delete file:
      const response: any = await awsS3.deleteObject(params).promise();

      // 2) Validate response:
      s3DeleteResponseSchema.parse(response);

      // 3) Convert response to model
      const deleteFileResponse: DeleteFileResponse =
        toModelDeleteFileResponse(response);

      return deleteFileResponse;
    } catch (error) {
      throw new ClientError('Error deleting file from AWS S3.', error);
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

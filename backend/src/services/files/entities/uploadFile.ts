// External packages:
import { z } from 'zod';

// Internal modules:
import { UploadFileResponse } from '../../../models/files';

// Define AWS S3 upload response schema:
export const s3UploadResponseSchema = z.object({
  ETag: z.string().optional(),
  ServerSideEncryption: z.string().optional(),
  VersionId: z.string().optional(),
  Location: z.string().optional(),
  key: z.string().optional(),
  Key: z.string().optional(),
  Bucket: z.string().optional(),
});

// Define AWS S3 upload response type:
export type s3UploadResponse = z.infer<typeof s3UploadResponseSchema>;

// Converter AWS upload response to model:
export const toModeUploadFileResponse = (
  awsS3Response: s3UploadResponse
): UploadFileResponse => {
  return {
    key: awsS3Response.key ?? '',
    bucket: awsS3Response.Bucket ?? '',
    url: awsS3Response.Location ?? '',
    message: awsS3Response.Location
      ? 'File uploaded successfully.'
      : 'Error uploading file.',
  };
};

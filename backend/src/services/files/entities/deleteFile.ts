// External packages:
import { z } from 'zod';

// Internal modules:
import { DeleteFileResponse } from '../../../models/files';

// Define AWS S3 delete response schema:
export const s3DeleteResponseSchema = z.object({
  DeleteMarker: z.boolean().optional(),
  VersionId: z.string().optional(),
});

// Define AWS S3 delete response type:
export type s3DeleteResponse = z.infer<typeof s3DeleteResponseSchema>;

// Converter AWS delete response to model:
export const toModelDeleteFileResponse = (
  awsS3Response: s3DeleteResponse
): DeleteFileResponse => {
  return {
    deleted: awsS3Response.DeleteMarker ?? false,
    versionIdDeletedDocument: awsS3Response.VersionId ?? '',
    message: awsS3Response.DeleteMarker
      ? 'File deleted successfully.'
      : 'Error deleting file.',
  };
};

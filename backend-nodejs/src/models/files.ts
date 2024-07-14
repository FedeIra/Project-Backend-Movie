// Model for aws s3 files
export type FilesS3 = {
  bucketName: string;
  totalFiles: number;
  files: {
    name: string;
    lastUpdated: Date;
    size: number;
  }[];
};

// Model for upload file response
export type UploadFileResponse = {
  key?: string;
  bucket?: string;
  url?: string;
  message: string;
};

// Model for delete file response
export type DeleteFileResponse = {
  deleted: boolean;
  versionIdDeletedDocument?: string;
  message: string;
};

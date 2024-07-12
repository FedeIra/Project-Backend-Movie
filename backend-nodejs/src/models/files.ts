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

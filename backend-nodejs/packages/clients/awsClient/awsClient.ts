// External packages:
import AWS from 'aws-sdk';

// Internal packages:
import config from '../../../packages/env/config.js';

AWS.config.update({
  accessKeyId: config.awsAccessKeyId,
  secretAccessKey: config.awsSecretAccessKey,
  region: config.awsRegion,
});

export const s3 = new AWS.S3();
// export const lambda = new AWS.Lambda();
// export const dynamoDB = new AWS.DynamoDB.DocumentClient();

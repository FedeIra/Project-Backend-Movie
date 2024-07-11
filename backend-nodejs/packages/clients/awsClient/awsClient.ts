// External packages:
import AWS from 'aws-sdk';

// Internal packages:
import config from '../../../packages/env/config.js';

AWS.config.update({
  accessKeyId: config.aws.accessKey,
  secretAccessKey: config.aws.secretKey,
  region: config.aws.region,
});

export const s3 = new AWS.S3();
// export const lambda = new AWS.Lambda();
// export const dynamoDB = new AWS.DynamoDB.DocumentClient();

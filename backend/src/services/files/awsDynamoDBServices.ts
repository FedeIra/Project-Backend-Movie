// Internal packages:
import { awsDynamoDB } from '../../../packages/clients/awsClient/awsClient';
import config from '../../../packages/env/config';
import { ClientError } from '../../../packages/errors/clientError.js';

// Define service interface:
export interface AwsDynamoDBService {
  createDocument(document: any): Promise<any>;
}

export class DynamoDBServiceImpl implements AwsDynamoDBService {
  // Service to create a document in DynamoDB
  async createDocument(document: any): Promise<any> {
    try {
      const params = {
        TableName: config.aws.dynamoDBTableName,
        Item: document,
      };

      const response = await awsDynamoDB.put(params).promise();
      console.log(
        '🚀 ~ DynamoDBServiceImpl ~ createDocument ~ response:',
        response
      );

      return response;
    } catch (error) {
      throw new ClientError('Error creating document in DynamoDB.', error);
    }
  }
}

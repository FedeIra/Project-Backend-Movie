import { CustomError } from './customError.js';

export class ClientError extends CustomError {
  constructor(message: string, details?: any) {
    super(message, 400, details);
  }
}

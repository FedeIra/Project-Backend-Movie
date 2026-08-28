import { CustomError } from './customError.js';

// Client error class:

export class ClientError extends CustomError {
  constructor(message: string, details?: any) {
    super(message, 400, details);
  }
}

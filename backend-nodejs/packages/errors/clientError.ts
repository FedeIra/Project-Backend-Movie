import { CustomError } from './customError.js';

export class ClientError extends CustomError {
  constructor(message: string) {
    super(message, 400);
  }
}

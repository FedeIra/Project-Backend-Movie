import { CustomError } from './customError.js';

export class ServerError extends CustomError {
  constructor(message: string) {
    super(message, 500);
  }
}

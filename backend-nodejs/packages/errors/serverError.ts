import { CustomError } from './customError.js';

export class ServerError extends CustomError {
  constructor(message: string, details?: unknown) {
    super(message, 500, details);
  }
}

import { CustomError } from './customError.js';

// Server error class:

export class ServerError extends CustomError {
  constructor(message: string, details?: unknown) {
    super(message, 500, details);
  }
}

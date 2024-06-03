import { CustomError } from './customError.js';

// Unauthorized error class:
export class UnauthorizedError extends CustomError {
  constructor(message: string, details?: unknown) {
    super(message, 401, details);
  }
}

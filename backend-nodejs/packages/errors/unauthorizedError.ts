import { CustomError } from './customError.js';

export class UnauthorizedError extends CustomError {
  constructor(message: string) {
    super(message, 401);
  }
}

// Custom error class to handle errors in a more structured way:
export class CustomError extends Error {
  private statusCode: number;
  private details: unknown;

  constructor(message: string, statusCode: number, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }

  getMessage(): string {
    return this.message;
  }

  getStatusCode(): number {
    return this.statusCode;
  }

  getDetails(): unknown {
    return this.details;
  }
}

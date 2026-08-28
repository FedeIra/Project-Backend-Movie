// External packages:
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

// Internal modules:
import { ZodError } from 'zod';
import { CustomError } from '../packages/errors/customError.js';

enum HttpStatus {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  INTERNAL_SERVER_ERROR = 500,
}

interface ErrorResponse {
  errorCode: number;
  error: string;
  validationErrors?: Array<{ path: string; message: string }>;
  errorDetails?: unknown;
}

// Internal error details (message, stack, raw cause, etc.) must never reach
// the client in production - they can leak file paths, stack traces, or
// data from the original error. Read NODE_ENV lazily (not at module load)
// so tests can flip it without module-registry tricks.
const isProduction = (): boolean => process.env.NODE_ENV === 'production';

const handleCustomError = (error: CustomError): ErrorResponse => ({
  errorCode: error.getStatusCode(),
  error: error.getMessage(),
  ...(isProduction() ? {} : { errorDetails: error.getDetails() }),
});

const handleZodError = (error: ZodError): ErrorResponse => ({
  errorCode: HttpStatus.BAD_REQUEST,
  error: 'Bad request.',
  validationErrors: error.errors.map((err) => ({
    path: err.path.join('.'),
    message: err.message,
  })),
});

const handleGenericError = (error: Error): ErrorResponse => ({
  errorCode: HttpStatus.INTERNAL_SERVER_ERROR,
  error: 'Internal server error.',
  ...(isProduction()
    ? {}
    : {
        errorDetails: {
          message: error.message,
          stack: error.stack,
        },
      }),
});

export const setupErrorHandler = (fastifyServer: FastifyInstance) => {
  fastifyServer.setErrorHandler(
    (
      error: Error | ZodError,
      request: FastifyRequest,
      response: FastifyReply
    ) => {
      let errorResponse: ErrorResponse;

      if (error instanceof CustomError) {
        errorResponse = handleCustomError(error);
      } else if (error instanceof ZodError) {
        errorResponse = handleZodError(error);
      } else {
        errorResponse = handleGenericError(error);
      }

      response.status(errorResponse.errorCode).send(errorResponse);
    }
  );
};

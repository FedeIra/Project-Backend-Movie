// External packages:
import { FastifyInstance } from 'fastify';

// Internal modules:
import { ZodError } from 'zod';
import { CustomError } from '../packages/errors/customError.js';

export const setupErrorHandler = (fastifyServer: FastifyInstance) => {
  fastifyServer.setErrorHandler(
    (error: Error | ZodError, request, response) => {
      // Define error status:
      const status =
        error instanceof CustomError
          ? error.getStatusCode()
          : error instanceof ZodError
            ? 400
            : 500;

      // Define error message:
      const message =
        error instanceof CustomError
          ? error.getMessage()
          : error instanceof ZodError
            ? 'Bad request.'
            : 'Internal server error.';

      // Define if validation errors:
      const validationErrors =
        error instanceof ZodError
          ? error.errors.map((err) => ({
              path: err.path.join('.'),
              message: err.message,
            }))
          : undefined;

      // Define error code:
      const errorCode = status;

      // Define error details:
      const errorDetails =
        error instanceof CustomError
          ? error.getDetails()
          : {
              message: error.message,
              stack: error.stack,
            };

      response
        .status(status)
        .send({ errorCode, error: message, validationErrors, errorDetails });
    }
  );
};

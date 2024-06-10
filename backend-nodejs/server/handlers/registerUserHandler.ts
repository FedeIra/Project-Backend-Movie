// External packages:
import { FastifyInstance } from 'fastify';
import { z } from 'zod';

// Internal modules:
import {
  RegisterUserUseCase,
  RegisterUserPayload,
  RegisterUserUseCaseResponse,
} from '../../src/useCases/users/registerUserUseCase.js';

// Handler request body schema:
const registerUserRequestBodySchema = z
  .object({
    username: z.string(),
    password: z.string(),
    email: z.string(),
  })
  .strict();

type RegisterUserRequestBody = z.infer<typeof registerUserRequestBodySchema>;

// Handler function:
export const registerUserHandler = (
  fastifyServer: FastifyInstance,
  registerUserUseCase: RegisterUserUseCase
): void => {
  fastifyServer.post(`/register-user`, async (request, response) => {
    try {
      // 1) Validate request body:
      const payload: RegisterUserRequestBody =
        registerUserRequestBodySchema.parse(request.body);
      // 2) Convert request body to use case payload:
      const useCasePayload: RegisterUserPayload = toUseCasePayload(payload);
      // 3) Call use case:
      const user: RegisterUserUseCaseResponse =
        await registerUserUseCase.registerUser(useCasePayload);

      return response.status(200).send(user);
    } catch (error) {
      throw error;
    }
  });
};

// Request body to use case payload conversion function:
const toUseCasePayload = (
  payload: RegisterUserRequestBody
): RegisterUserPayload => {
  return {
    username: payload.username,
    password: payload.password,
    email: payload.email,
  };
};

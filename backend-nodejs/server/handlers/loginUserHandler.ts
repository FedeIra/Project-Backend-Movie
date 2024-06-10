// External packages:
import { FastifyInstance } from 'fastify';
import { z } from 'zod';

// Internal modules:
import {
  LoginUserUseCase,
  LoginUserPayload,
  LoginUserResponse,
} from '../../src/useCases/users/loginUserUseCase';

// Handler request body schema:
const loginRequestBodySchema = z
  .object({
    username: z.string(),
    password: z.string(),
  })
  .strict();

type LoginRequestBody = z.infer<typeof loginRequestBodySchema>;

// Handler function:
export const loginHandler = (
  fastifyServer: FastifyInstance,
  loginUserUseCase: LoginUserUseCase
): void => {
  fastifyServer.post('/login-user', async (request, response) => {
    try {
      // 1) Validate request body:
      const payload: LoginRequestBody = loginRequestBodySchema.parse(
        request.body
      );

      // 2) Convert request body to use case payload:
      const useCasePayload: LoginUserPayload = toUseCasePayload(payload);

      // 3) Call use case:
      const user: LoginUserResponse =
        await loginUserUseCase.loginUser(useCasePayload);

      return response.status(200).send(user);
    } catch (error) {
      throw error;
    }
  });
};

// Request body to use case payload conversion function:
const toUseCasePayload = (payload: LoginRequestBody): LoginUserPayload => {
  return {
    username: payload.username,
    password: payload.password,
  };
};

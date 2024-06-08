// External packages:
import { FastifyInstance } from 'fastify';
import { z } from 'zod';

// Internal modules:
import { RefreshTokenUseCase } from '../../src/useCases/users/refreshTokenUseCase';

// Handler request body schema:
const refreshTokenRequestBodySchema = z
  .object({
    currentToken: z.string(),
  })
  .strict();

type RefreshTokenRequestBody = z.infer<typeof refreshTokenRequestBodySchema>;

// Handler function:
export const refreshTokenHandler = (
  server: FastifyInstance,
  refreshTokenUseCase: RefreshTokenUseCase
) => {
  server.post('/refresh-token', async (request, response) => {
    try {
      // 1) Validate request body:
      const payload: RefreshTokenRequestBody =
        refreshTokenRequestBodySchema.parse(request.body);

      // 2) Call use case:
      const newToken: string = await refreshTokenUseCase.refreshToken({
        previousToken: payload.currentToken,
      });

      return response.status(200).send(newToken);
    } catch (error) {
      throw error;
    }
  });
};

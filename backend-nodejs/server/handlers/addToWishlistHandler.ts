// External packages:
import { FastifyInstance } from 'fastify';
import { z } from 'zod';

// Internal modules:
import {
  AddToWishlistUseCase,
  AddToWishlistPayload,
} from '../../src/useCases/users/addToWishlistUseCase';

// Handler request body schema:
const addToWishlistRequestBodySchema = z
  .object({
    username: z.string(),
    contentToAdd: z.object({
      id: z.number(),
      title: z.string(),
      poster: z.string(),
    }),
  })
  .strict();

type AddToWishlistRequestBody = z.infer<typeof addToWishlistRequestBodySchema>;

// Handler function:
export const addToWishlistHandler = (
  fastifyServer: FastifyInstance,
  addToWishlistUseCase: AddToWishlistUseCase
): void => {
  fastifyServer.post(
    `/add-to-wishlist`,
    { preValidation: [fastifyServer.authenticate] },
    async (request, response) => {
      try {
        // 1) Validate request body:
        const payload: AddToWishlistRequestBody =
          addToWishlistRequestBodySchema.parse(request.body);
        // 2) Convert request body to use case payload:
        const useCasePayload: AddToWishlistPayload = toUseCasePayload(payload);

        // 3) Call use case:
        await addToWishlistUseCase.addToWishlist(useCasePayload);

        return response
          .status(200)
          .send({ message: 'Added to wishlist. Enjoy!' });
      } catch (error) {
        throw error;
      }
    }
  );
};

// Request body to use case payload conversion function:
const toUseCasePayload = (
  payload: AddToWishlistRequestBody
): AddToWishlistPayload => {
  return {
    username: payload.username,
    newContent: payload.contentToAdd,
  };
};

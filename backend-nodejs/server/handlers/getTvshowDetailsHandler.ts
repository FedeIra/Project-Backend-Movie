// External packages:
import { FastifyInstance } from 'fastify';
import { z } from 'zod';

// Internal modules:
import { GetTvshowDetailsUseCase } from '../../src/useCases/tvShows/getTvshowsDetaillsUseCase';
import { TvShowDetails } from '../../src/models/tvShowDetails';

const getTvshowDetailsRequestBodySchema = z
  .object({
    tvshowId: z.string(),
  })
  .strict();

type GetTvshowDetailsRequestBody = z.infer<
  typeof getTvshowDetailsRequestBodySchema
>;

// Handler function:
export const getTvshowDetailsHandler = (
  fastifyServer: FastifyInstance,
  getTvshowDetailsUseCase: GetTvshowDetailsUseCase
): void => {
  fastifyServer.post(
    `/tvshow-details`,
    { preValidation: [fastifyServer.authenticate] },
    async (request, response) => {
      try {
        // 1) Validate request body:
        const payload: GetTvshowDetailsRequestBody =
          getTvshowDetailsRequestBodySchema.parse(request.body);

        // 2) Call use case:
        const tvshowDetails: TvShowDetails =
          await getTvshowDetailsUseCase.getTvshowDetails({
            tvshowId: payload.tvshowId,
          });

        return response.status(200).send(tvshowDetails);
      } catch (error) {
        throw error;
      }
    }
  );
};

// External packages:
import { FastifyInstance } from 'fastify';
import { z } from 'zod';

// Internal modules:
import {
  GetMoviesUseCase,
  GetMoviesUseCasePayload,
} from '../../src/useCases/movies/getMovies.js';
import { Movie } from '../../src/models/movies.js';

// 1) Define request body schema:
const getMoviesRequestBodySchema = z
  .object({
    filters: z
      .object({
        genre: z.string().optional(),
        recommended: z.boolean().optional(),
        year: z.number().optional(),
      })
      .optional(),
    sorts: z
      .object({
        byDate: z.boolean().optional(),
        byAverage: z.boolean().optional(),
      })
      .optional(),
  })
  .strict();

type GetMoviesRequestBody = z.infer<typeof getMoviesRequestBodySchema>;

export const getMoviesHandler = (
  fastifyServer: FastifyInstance,
  getMoviesUseCase: GetMoviesUseCase
): void => {
  fastifyServer.post(`/movies`, async (request, response) => {
    try {
      // 2) Validate request body:
      const payload: GetMoviesRequestBody = getMoviesRequestBodySchema.parse(
        request.body
      );
      // 3) Convert request body to use case payload:
      const useCasePayload: GetMoviesUseCasePayload = toUseCasePayload(payload);
      // 4) Call use case:
      const movies: Movie[] = await getMoviesUseCase.getMovies(useCasePayload);

      return response.status(200).send(movies);
    } catch (error) {
      throw error;
    }
  });
};

// Request body to use case payload conversion function:
const toUseCasePayload = (
  payload: GetMoviesRequestBody
): GetMoviesUseCasePayload => {
  return {
    filters: {
      genre: payload.filters?.genre ?? '',
      recommended: payload.filters?.recommended ?? false,
      year: payload.filters?.year ?? 0,
    },
    sorts: {
      byDate: payload.sorts?.byDate ?? false,
      byAverage: payload.sorts?.byAverage ?? false,
    },
  };
};

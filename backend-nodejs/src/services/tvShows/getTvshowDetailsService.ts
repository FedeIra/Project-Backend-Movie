// External packages:
import { ZodError } from 'zod';

// Internal modules:
import { TmdbClient } from '../../../packages/clients/tmdbClient/tmdbClient.js';
import config from '../../../packages/env/config.js';
import { ClientError } from '../../../packages/errors/clientError.js';
import { TvShowDetails } from '../../models/tvShowDetails.js';
import {
  tmdbTvshowDetailsSchema,
  toModelTvShowDetails,
  TmdbTvshowDetailsDTO,
} from './entities/tvShow.js';

// Define service interface:
export interface TvShowService {
  getTvShowDetailsService(tvShowId: string): Promise<TvShowDetails>;
}

// Define service class:
export class TMDBTvShowService implements TvShowService {
  constructor(private client: TmdbClient) {}

  // 1) TMDB external service for getting movies:
  async getTvShowDetailsService(tvShowId: string): Promise<TvShowDetails> {
    try {
      const tmdbResponse: TmdbTvshowDetailsDTO = await this.client.send({
        method: 'get',
        path: `/tv/${tvShowId}?api_key=${config.tmdbApiKey}`,
      });

      // 2) Validate response:

      tmdbTvshowDetailsSchema.parse(tmdbResponse);

      // 3) Convert response to model:
      const tvShowDetails: TvShowDetails = toModelTvShowDetails(tmdbResponse);

      return tvShowDetails;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ClientError('TMDB incorrect response.', error);
      } else {
        throw new ClientError('TMDB service error.', error);
      }
    }
  }
}

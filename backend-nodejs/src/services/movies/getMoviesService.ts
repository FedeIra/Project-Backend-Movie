import { TmdbClient } from '../../../packages/clients/tmdbClient/tmdbClient.js';
import config from '../../../packages/env/config.js';

export interface MoviesService {
  getMovies(payload: any): Promise<any>;
}

export class TMDBMoviesService implements MoviesService {
  constructor(private client: TmdbClient) {}

  async getMovies(payload: any): Promise<any[]> {
    const apiResponse: any = await this.client.send({
      method: 'get',
      path: `/trending/movie/day?api_key=${config.tmdbApiKey}`,
      payload: {},
    });

    // const apiResponseValidation =
    //   getMoviesResponseSchema.parse(apiResponse);

    // const movies = toModelMovies(apiResponseValidation);

    return apiResponse;
  }
}

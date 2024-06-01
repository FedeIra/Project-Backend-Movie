// Import internal packages:
import { TmdbClient } from '../../../../packages/clients/tmdbClient/tmdbClient.js';
import config from '../../../../packages/env/config.js';
import { Movie } from '../../../models/movies.js';
import { tmdbMoviesSchema } from './entities/movies.js';
import { TmdbMoviesResponse } from './entities/movies.js';
import { toModelMovies } from './entities/movies.js';

export interface MoviesService {
  getMoviesService(payload: any): Promise<Movie[]>;
}

export class TMDBMoviesService implements MoviesService {
  constructor(private client: TmdbClient) {}

  async getMoviesService(payload: any): Promise<Movie[]> {
    const tmdbResponse: TmdbMoviesResponse = await this.client.send({
      method: 'get',
      path: `/trending/movie/day?api_key=${config.tmdbApiKey}`,
      payload: {},
    });

    const apiResponseValidation: TmdbMoviesResponse =
      tmdbMoviesSchema.parse(tmdbResponse);

    const movies: Movie[] = toModelMovies(apiResponseValidation);

    return movies;
  }
}

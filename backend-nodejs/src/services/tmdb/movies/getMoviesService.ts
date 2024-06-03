// Import internal packages:
import { TmdbClient } from '../../../../packages/clients/tmdbClient/tmdbClient.js';
import config from '../../../../packages/env/config.js';
import { Movie } from '../../../models/movies.js';
import { tmdbMoviesSchema } from './entities/movies.js';
import { TmdbMovieDTO } from './entities/movies.js';
import { toModelMovies } from './entities/movies.js';

export interface MoviesService {
  getMoviesService(): Promise<Movie[]>;
}

export class TMDBMoviesService implements MoviesService {
  constructor(private client: TmdbClient) {}

  async getMoviesService(): Promise<Movie[]> {
    const tmdbResponse: TmdbMovieDTO = await this.client.send({
      method: 'get',
      path: `/trending/movie/week?api_key=${config.tmdbApiKey}`,
    });

    const apiResponseValidation: TmdbMovieDTO =
      tmdbMoviesSchema.parse(tmdbResponse);

    const movies: Movie[] = toModelMovies(apiResponseValidation);

    return movies;
  }
}

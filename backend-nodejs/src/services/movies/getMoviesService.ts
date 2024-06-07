// Internal modules:
import { TmdbClient } from '../../../packages/clients/tmdbClient/tmdbClient.js';
import config from '../../../packages/env/config.js';
import { Movie } from '../../models/movies.js';
import {
  tmdbMoviesSchema,
  toModelMovies,
  TmdbMovieDTO,
} from './entities/movies.js';

// Define service interface:
export interface MoviesService {
  getMoviesService(): Promise<Movie[]>;
}

// Define service class:
export class TMDBMoviesService implements MoviesService {
  constructor(private client: TmdbClient) {}

  // 1) TMDB external service for getting movies:
  async getMoviesService(): Promise<Movie[]> {
    const tmdbResponse: TmdbMovieDTO = await this.client.send({
      method: 'get',
      path: `/trending/movie/week?api_key=${config.tmdbApiKey}`,
    });

    // 2) Validate response:
    const apiResponseValidation: TmdbMovieDTO =
      tmdbMoviesSchema.parse(tmdbResponse);

    // 3) Convert response to model:
    const movies: Movie[] = toModelMovies(apiResponseValidation);

    return movies;
  }
}

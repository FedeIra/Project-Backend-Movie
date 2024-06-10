// External packages:
import { ZodError } from 'zod';

// Internal modules:
import { TmdbClient } from '../../../packages/clients/tmdbClient/tmdbClient.js';
import config from '../../../packages/env/config.js';
import { ClientError } from '../../../packages/errors/clientError.js';
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
    try {
      const tmdbResponse: TmdbMovieDTO = await this.client.send({
        method: 'get',
        path: `/trending/movie/week?api_key=${config.tmdbApiKey}`,
      });

      // 2) Validate response:
      tmdbMoviesSchema.parse(tmdbResponse);

      // 3) Convert response to model:
      const movies: Movie[] = toModelMovies(tmdbResponse);

      return movies;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ClientError('TMDB movies incorrect response.', {
          validationErrors: error.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        });
      } else {
        throw new ClientError('TMDB service error.', error);
      }
    }
  }
}

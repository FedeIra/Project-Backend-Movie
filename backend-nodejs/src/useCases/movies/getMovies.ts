import { MoviesService } from '../../services/tmdb/movies/getMoviesService.js';
import { Movie } from '../../models/movies.js';

export class GetMoviesUseCase {
  constructor(private moviesService: MoviesService) {}

  async getMovies(payload: any): Promise<Movie[]> {
    return this.moviesService.getMoviesService(payload);
  }
}

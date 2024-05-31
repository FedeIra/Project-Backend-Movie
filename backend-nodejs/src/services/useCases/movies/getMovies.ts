import { MoviesService } from '../../../services/movies/getMoviesService.js';

export class GetMoviesUseCase {
  constructor(private moviesService: MoviesService) {}

  async getMovies(payload: any): Promise<any> {
    return this.moviesService.getMovies(payload);
  }
}

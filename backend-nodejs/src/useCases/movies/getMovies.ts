import { MoviesService } from '../../services/tmdb/movies/getMoviesService.js';
import { Movie } from '../../models/movies.js';

export type GetMoviesUseCasePayload = {
  genre: string;
  recommended: boolean;
  year: number;
};
export class GetMoviesUseCase {
  constructor(private moviesService: MoviesService) {}

  async getMovies(payload: GetMoviesUseCasePayload): Promise<Movie[]> {
    const movies = await this.moviesService.getMoviesService();

    return this.applyFilters(movies, payload);
  }

  private applyFilters(
    movies: Movie[],
    payload: GetMoviesUseCasePayload
  ): Movie[] {
    let filteredMovies: Movie[] = movies;

    if (payload.genre) {
      filteredMovies = filteredMovies.filter((movie) =>
        movie.genres.includes(payload.genre)
      );
    }
    if (payload.recommended) {
      filteredMovies = filteredMovies.filter((movie) => movie.average >= 7);
    }
    if (payload.year) {
      filteredMovies = filteredMovies.filter(
        (movie) => new Date(movie.releaseDate).getFullYear() === payload.year
      );
    }
    return filteredMovies;
  }
}

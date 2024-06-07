// Internal modules:
import { MoviesService } from '../../services/movies/getMoviesService.js';
import { Movie } from '../../models/movies.js';

// Define use case payload schema:
export type GetMoviesUseCasePayload = {
  filters: {
    genre: string;
    recommended: boolean;
    year: number;
  };
  sorts: {
    byDate: boolean;
    byAverage: boolean;
  };
};

// Define use cases for getting movies:
export class GetMoviesUseCase {
  constructor(private moviesService: MoviesService) {}

  // Use case for getting movies:
  async getMovies(payload: GetMoviesUseCasePayload): Promise<Movie[]> {
    const movies: Movie[] = await this.moviesService.getMoviesService();

    const filteredMovies: Movie[] = this.applyFilters(movies, payload);

    const filteredSortedMovies: Movie[] = this.applySorts(
      filteredMovies,
      payload
    );

    return filteredSortedMovies;
  }

  // Use case helper filter function:
  private applyFilters(
    movies: Movie[],
    payload: GetMoviesUseCasePayload
  ): Movie[] {
    let filteredMovies: Movie[] = movies;

    // Genre filter:
    if (payload.filters.genre) {
      filteredMovies = filteredMovies.filter((movie) =>
        movie.genres.includes(payload.filters.genre)
      );
    }
    // Recommended filter:
    if (payload.filters.recommended) {
      filteredMovies = filteredMovies.filter((movie) => movie.average >= 7);
    }
    // Year filter:
    if (payload.filters.year) {
      filteredMovies = filteredMovies.filter(
        (movie) =>
          new Date(movie.releaseDate).getFullYear() === payload.filters.year
      );
    }
    return filteredMovies;
  }

  // Use case helper sort function:
  private applySorts(
    movies: Movie[],
    payload: GetMoviesUseCasePayload
  ): Movie[] {
    let sortedMovies: Movie[] = movies;

    // Sort by date:
    if (payload.sorts.byDate) {
      sortedMovies = sortedMovies.sort(
        (a, b) =>
          new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
      );
    }

    // Sort by average:
    if (payload.sorts.byAverage) {
      sortedMovies = sortedMovies.sort((a, b) => b.average - a.average);
    }
    return sortedMovies;
  }
}

// Internal modules:
// import { MoviesService } from '../../services/movies/getMoviesService.js';
// import { Movie } from '../../models/movies.js';
import { AwsS3Service } from '../../services/files/awsS3Services.js';

// Define use cases for getting movies:
export class GetFilesListUseCase {
  constructor(private filesService: AwsS3Service) {}

  // Use case for getting movies:
  async getFiles(): Promise<any> {
    // 1) Get movies from service:
    const filesList: any = await this.filesService.listFiles();

    // 2) Apply filters and sorts:
    // const filteredMovies: Movie[] = this.applyFilters(movies, payload);

    // const filteredSortedMovies: Movie[] = this.applySorts(
    //   filteredMovies,
    //   payload
    // );

    return filesList;
  }

  // Use case helper filter function:
  // private applyFilters(
  //   movies: Movie[],
  //   payload: GetMoviesUseCasePayload
  // ): Movie[] {
  //   let filteredMovies: Movie[] = movies;

  //   // Genre filter:
  //   if (payload.filters.genre) {
  //     filteredMovies = filteredMovies.filter((movie) =>
  //       movie.genres.includes(payload.filters.genre)
  //     );
  //   }
  //   // Recommended filter:
  //   if (payload.filters.recommended) {
  //     filteredMovies = filteredMovies.filter((movie) => movie.average >= 7);
  //   }
  //   // Year filter:
  //   if (payload.filters.year) {
  //     filteredMovies = filteredMovies.filter(
  //       (movie) =>
  //         new Date(movie.releaseDate).getFullYear() === payload.filters.year
  //     );
  //   }
  //   return filteredMovies;
  // }
}

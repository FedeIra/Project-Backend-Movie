// External packages:
import { z } from 'zod';

// Internal modules:
import { Movie } from '../../../models/movies';

// Define TMDB movie response schema:
export const tmdbMoviesSchema = z.object({
  page: z.number().optional(),
  results: z.array(
    z.object({
      backdrop_path: z.string().optional(),
      id: z.number(),
      original_title: z.string().optional(),
      overview: z.string(),
      poster_path: z.string(),
      media_type: z.string().optional(),
      adult: z.boolean().optional(),
      title: z.string(),
      original_language: z.string().optional(),
      genre_ids: z.array(z.number()),
      popularity: z.number().optional(),
      release_date: z.string(),
      video: z.boolean(),
      vote_average: z.number(),
      vote_count: z.number().optional(),
    })
  ),
  total_pages: z.number().optional(),
  total_results: z.number().optional(),
});

// Define TMDB movie DTO type:
export type TmdbMovieDTO = z.infer<typeof tmdbMoviesSchema>;

// Converter TMDB movie response to model:
export const toModelMovies = (tmdbMoviesResponse: TmdbMovieDTO): Movie[] => {
  const baseTmdbImageUrl =
    'https://image.tmdb.org/t/p/original/aKrDLfQX30tHaTIC2ZRAxG2PbQw.jpg';
  const movies: Movie[] = tmdbMoviesResponse.results.map((movie) => {
    return {
      id: movie.id,
      title: movie.title,
      poster: `${baseTmdbImageUrl}${movie.poster_path}`,
      description: movie.overview,
      average: movie.vote_average,
      releaseDate: movie.release_date,
      genres: movie.genre_ids.map((genreId) => {
        const genreMap: Record<number, string> = {
          28: 'Action',
          12: 'Adventure',
          16: 'Animation',
          35: 'Comedy',
          80: 'Crime',
          99: 'Documentary',
          18: 'Drama',
          10751: 'Family',
          14: 'Fantasy',
          36: 'History',
          27: 'Horror',
          10402: 'Music',
          9648: 'Mystery',
          10749: 'Romance',
          878: 'Science Fiction',
          10770: 'TV Movie',
          53: 'Thriller',
          10752: 'War',
          37: 'Western',
        };
        return genreMap[genreId];
      }),
    };
  });
  return movies;
};

import { z } from 'zod';

import { Movie } from '../../../../models/movies';

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

export type TmdbMoviesResponse = z.infer<typeof tmdbMoviesSchema>;

export const toModelMovies = (
  tmdbMoviesResponse: TmdbMoviesResponse
): Movie[] => {
  const baseTmdbImageUrl =
    'https://image.tmdb.org/t/p/original/aKrDLfQX30tHaTIC2ZRAxG2PbQw.jpg';
  return tmdbMoviesResponse.results.map((movie) => {
    return {
      id: movie.id,
      title: movie.title,
      poster: `${baseTmdbImageUrl}${movie.poster_path}`,
      description: movie.overview,
      average: movie.vote_average,
      releaseDate: movie.release_date,
      genres: movie.genre_ids.map((genreId) => {
        switch (genreId) {
          case 28:
            return 'Action';
          case 12:
            return 'Adventure';
          case 16:
            return 'Animation';
          case 35:
            return 'Comedy';
          case 80:
            return 'Crime';
          case 99:
            return 'Documentary';
          case 18:
            return 'Drama';
          case 10751:
            return 'Family';
          case 14:
            return 'Fantasy';
          case 36:
            return 'History';
          case 27:
            return 'Horror';
          case 10402:
            return 'Music';
          case 9648:
            return 'Mystery';
          case 10749:
            return 'Romance';
          case 878:
            return 'Science Fiction';
          case 10770:
            return 'TV Movie';
          case 53:
            return 'Thriller';
          case 10752:
            return 'War';
          case 37:
            return 'Western';
          default:
            return 'Unknown';
        }
      }),
    };
  });
};

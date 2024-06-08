// External packages:
import { z } from 'zod';

// Internal modules:
import { TvShowDetails } from '../../../models/tvShowDetails';

// Define TMDB movie response schema:
export const tmdbTvshowDetailsSchema = z.object({
  adult: z.boolean().optional().nullable(),
  backdrop_path: z.string().optional().nullable(),
  created_by: z.array(z.object({ zod: z.unknown() })),
  episode_run_time: z.array(z.number()),
  first_air_date: z.string(),
  genres: z.array(z.object({ id: z.number(), name: z.string() })),
  homepage: z.string().optional().nullable(),
  id: z.number(),
  in_production: z.boolean().optional().nullable(),
  languages: z.array(z.string()).optional().nullable(),
  last_air_date: z.string().optional().nullable(),
  last_episode_to_air: z
    .object({
      id: z.number().optional().nullable(),
      overview: z.string().optional().nullable(),
      name: z.string().optional().nullable(),
      vote_average: z.number().optional().nullable(),
      vote_count: z.number().optional().nullable(),
      air_date: z.string().optional().nullable(),
      episode_number: z.number().optional().nullable(),
      episode_type: z.string().optional().nullable(),
      production_code: z.string().optional().nullable(),
      runtime: z.number().optional().nullable(),
      season_number: z.number().optional().nullable(),
      show_id: z.number().optional().nullable(),
      still_path: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
  name: z.string(),
  next_episode_to_air: z.unknown().nullable().optional().nullable(),
  networks: z
    .array(
      z.object({
        id: z.number().optional().nullable(),
        logo_path: z.string().optional().nullable(),
        name: z.string().optional().nullable(),
        origin_country: z.string().optional().nullable(),
      })
    )
    .optional(),
  number_of_episodes: z.number().optional().nullable(),
  number_of_seasons: z.number(),
  origin_country: z.array(z.string()).optional().nullable(),
  original_language: z.string().optional().nullable(),
  original_name: z.string().optional().nullable(),
  overview: z.string().optional().nullable(),
  popularity: z.number().optional().nullable(),
  poster_path: z.string().nullable().nullable(),
  production_companies: z
    .array(z.object({ zod: z.unknown() }))
    .optional()
    .nullable(),
  production_countries: z
    .array(z.object({ iso_3166_1: z.string(), name: z.string() }))
    .optional()
    .nullable(),
  seasons: z.array(
    z.object({
      air_date: z.string().nullable(),
      episode_count: z.number(),
      id: z.number(),
      name: z.string().optional().nullable(),
      overview: z.string().optional().nullable(),
      poster_path: z.string().optional().nullable(),
      season_number: z.number(),
      vote_average: z.number().optional().nullable(),
    })
  ),
  spoken_languages: z
    .array(
      z.object({
        english_name: z.string(),
        iso_639_1: z.string(),
        name: z.string(),
      })
    )
    .optional()
    .nullable(),
  status: z.string().optional().nullable(),
  tagline: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  vote_average: z.number(),
  vote_count: z.number().optional().nullable(),
});

// Define TMDB tv show details DTO type:
export type TmdbTvshowDetailsDTO = z.infer<typeof tmdbTvshowDetailsSchema>;

// Converter TMDB movie response to model:
export const toModelTvShowDetails = (
  tmdbTvshowDetailsResponse: TmdbTvshowDetailsDTO
): TvShowDetails => {
  const baseTmdbImageUrl = 'https://image.tmdb.org/t/p/original';
  const tvShowDetails: TvShowDetails = {
    id: tmdbTvshowDetailsResponse.id,
    title: tmdbTvshowDetailsResponse.name,
    poster: tmdbTvshowDetailsResponse.poster_path
      ? `${baseTmdbImageUrl}${tmdbTvshowDetailsResponse.poster_path}`
      : 'No poster available.',
    average: tmdbTvshowDetailsResponse.vote_average,
    releaseDate: tmdbTvshowDetailsResponse.first_air_date,
    genres: tmdbTvshowDetailsResponse.genres.map((genre) => genre.name),
    numberOfSeasons: tmdbTvshowDetailsResponse.number_of_seasons,
    director: tmdbTvshowDetailsResponse.created_by.map((director) => director),
    seasons: tmdbTvshowDetailsResponse.seasons.map((season) => {
      return {
        seasonNumber: season.season_number,
        seasonId: season.id,
        releaseDate: season.air_date ?? 'Unknown',
        totalEpisodes: season.episode_count,
      };
    }),
  };
  return tvShowDetails;
};

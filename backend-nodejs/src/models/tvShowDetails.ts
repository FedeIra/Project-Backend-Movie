// Model for tv show details:
export type TvShowDetails = {
  id: number;
  title: string;
  poster: string | null;
  average: number;
  releaseDate: string;
  genres: string[];
  numberOfSeasons: number;
  director: unknown[];
  seasons: Seasons[];
};

export type Seasons = {
  seasonNumber: number;
  seasonId: number;
  releaseDate: string;
  totalEpisodes: number;
};

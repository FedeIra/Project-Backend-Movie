// Import external packages:
import 'dotenv/config';

const config = {
  port: process.env.PORT,
  host: process.env.HOST,
  tmdbApiKey: process.env.TMDB_API_KEY,
  tmdbBaseUrl: process.env.TMDB_BASE_URL,
};

export default config;

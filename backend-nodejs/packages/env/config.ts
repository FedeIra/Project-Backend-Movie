// Import external packages:
import 'dotenv/config';

// Environment variables:
const config = {
  port: process.env.PORT,
  host: process.env.HOST,
  tmdbApiKey: process.env.TMDB_API_KEY,
  tmdbBaseUrl: process.env.TMDB_BASE_URL,
  connectionStringDb: process.env.CONNECTION_STRING_DB,
  dbName: process.env.DB_NAME,
  usersCollection: process.env.USER_COLLECTION_NAME,
  jwtSecret: process.env.JWT_SECRET,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  awsRegion: process.env.AWS_REGION,
};

export default config;

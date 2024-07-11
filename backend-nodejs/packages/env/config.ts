// Import external packages:
import 'dotenv/config';
import { z } from 'zod';

// Schema for environment variables:
const envSchema = z
  .object({
    PORT: z.string().transform((value) => parseInt(value)) || z.number(),
    HOST: z.string(),
    TMDB_API_KEY: z.string(),
    TMDB_BASE_URL: z.string(),
    CONNECTION_STRING_DB: z.string(),
    DB_NAME: z.string(),
    USER_COLLECTION_NAME: z.string(),
    JWT_SECRET: z.string(),
    AWS_ACCESS_KEY: z.string(),
    AWS_SECRET_KEY: z.string(),
    AWS_REGION: z.string(),
  })
  .strict();

// Environment variables:
type ConfigEnvironmentVariables = z.infer<typeof envSchema>;

// Load and validate environment variables:
const environmentVariables = {
  PORT: process.env.PORT,
  HOST: process.env.HOST,
  TMDB_API_KEY: process.env.TMDB_API_KEY,
  TMDB_BASE_URL: process.env.TMDB_BASE_URL,
  CONNECTION_STRING_DB: process.env.CONNECTION_STRING_DB,
  DB_NAME: process.env.DB_NAME,
  USER_COLLECTION_NAME: process.env.USER_COLLECTION_NAME,
  JWT_SECRET: process.env.JWT_SECRET,
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
  AWS_REGION: process.env.AWS_REGION,
};

// Validate environment variables:
const validatedEnv: ConfigEnvironmentVariables =
  envSchema.parse(environmentVariables);

// Load environment variables:
const config = {
  port: validatedEnv.PORT,
  host: validatedEnv.HOST,
  tmdb: {
    apiKey: validatedEnv.TMDB_API_KEY,
    baseUrl: validatedEnv.TMDB_BASE_URL,
  },
  mongoDB: {
    connectionString: validatedEnv.CONNECTION_STRING_DB,
    dbName: validatedEnv.DB_NAME,
    userCollectionName: validatedEnv.USER_COLLECTION_NAME,
  },
  jwtSecret: validatedEnv.JWT_SECRET,
  aws: {
    accessKey: validatedEnv.AWS_ACCESS_KEY,
    secretKey: validatedEnv.AWS_SECRET_KEY,
    region: validatedEnv.AWS_REGION,
  },
};

export default config;

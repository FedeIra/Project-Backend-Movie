// External packages:
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { z } from 'zod';

// Internal modules:
import config from '../../../packages/env/config';

// Define types for TMDB client:
type HttpMethod = 'get' | 'post' | 'put' | 'delete';

type SendParams = {
  method: HttpMethod;
  path: string;
  payload?: unknown;
};

// Define TMDB error schema:
const TMDBErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});

// Define TMDB client class:
export class TmdbClient {
  private axios: AxiosInstance;
  private baseUrl: string;

  constructor() {
    this.baseUrl =
      config.tmdbBaseUrl ?? 'add https://api.themoviedb.org/3 to .env file';
    this.axios = axios.create();
  }

  // Method for sending requests to TMDB API:
  async send<T = unknown>(params: SendParams): Promise<T> {
    const { method, path, payload } = params;
    const fullUrl = `${this.baseUrl}${path}`;

    const requestConfig: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      switch (method) {
        case 'get': {
          const res = await this.axios.get<T>(fullUrl, requestConfig);
          return res.data;
        }
        case 'post': {
          const res = await this.axios.post<T>(fullUrl, payload, requestConfig);
          return res.data;
        }
        case 'put': {
          const res = await this.axios.put<T>(fullUrl, payload, requestConfig);
          return res.data;
        }
        case 'delete': {
          const res = await this.axios.delete<T>(fullUrl, requestConfig);
          return res.data;
        }
        default: {
          throw Error(`HTTP method ${method} not implemented`);
        }
      }
    } catch (error) {
      // Handle errors from TMDB API:
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const data = error.response?.data;
        if (status === 401) {
          throw new Error(`TMDB unauthorized the request`);
        }
        if (data !== undefined) {
          try {
            const apiError = TMDBErrorSchema.parse(data);
            throw new Error(
              `TMDB API error: ${apiError.error.code} - ${apiError.error.message}`
            );
          } catch {
            throw new Error(`TMDB API error: ${JSON.stringify(data)}`);
          }
        }
      }
      throw error;
    }
  }
}

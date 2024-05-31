import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { z } from 'zod';

import config from '../../../packages/env/config';

type HttpMethod = 'get' | 'post' | 'put' | 'delete';

type SendParams = {
  method: HttpMethod;
  path: string;
  payload: unknown;
};

const TMDBErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});

export class TmdbClient {
  private axios: AxiosInstance;
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.tmdbBaseUrl || '';
    this.axios = axios.create();
  }

  async send(params: SendParams): Promise<unknown> {
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
          const res = await this.axios.get(fullUrl, requestConfig);
          return res.data;
        }
        case 'post': {
          const res = await this.axios.post(fullUrl, payload, requestConfig);
          return res.data;
        }
        case 'put': {
          const res = await this.axios.put(fullUrl, payload, requestConfig);
          return res.data;
        }
        case 'delete': {
          const res = await this.axios.delete(fullUrl, requestConfig);
          return res.data;
        }
        default: {
          throw Error(`Not implemented`);
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          throw new Error(`TMDB unauthorized the request`);
        }
        const data = error.response?.data;
        if (data !== undefined) {
          try {
            const apiError = TMDBErrorSchema.parse(data);
            throw new Error(
              `rawg api error: ${apiError.error.code} - ${apiError.error.message}`
            );
          } catch {
            throw new Error(`TMDB api error: ${data}`);
          }
        }
      }
      throw error;
    }
  }
}

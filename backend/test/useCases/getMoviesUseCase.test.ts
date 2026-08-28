import { describe, expect, it } from 'vitest';

import { GetMoviesUseCase } from '../../src/useCases/movies/getMoviesUseCase.js';
import { Movie } from '../../src/models/movies.js';
import { MoviesService } from '../../src/services/movies/getMoviesService.js';

const buildMovie = (overrides: Partial<Movie>): Movie => ({
  id: 1,
  title: 'Movie',
  poster: 'poster.jpg',
  description: 'description',
  average: 5,
  releaseDate: '2020-01-01',
  genres: ['Action'],
  ...overrides,
});

const buildMoviesService = (movies: Movie[]): MoviesService => ({
  getMoviesService: async () => movies,
});

describe('GetMoviesUseCase', () => {
  it('returns every movie when no filters or sorts are set', async () => {
    const movies = [buildMovie({ id: 1 }), buildMovie({ id: 2 })];
    const useCase = new GetMoviesUseCase(buildMoviesService(movies));

    const result = await useCase.getMovies({
      filters: { genre: '', recommended: false, year: 0 },
      sorts: { byDate: false, byAverage: false },
    });

    expect(result).toHaveLength(2);
  });

  it('filters by genre', async () => {
    const movies = [
      buildMovie({ id: 1, genres: ['Action'] }),
      buildMovie({ id: 2, genres: ['Comedy'] }),
    ];
    const useCase = new GetMoviesUseCase(buildMoviesService(movies));

    const result = await useCase.getMovies({
      filters: { genre: 'Comedy', recommended: false, year: 0 },
      sorts: { byDate: false, byAverage: false },
    });

    expect(result).toEqual([expect.objectContaining({ id: 2 })]);
  });

  it('filters by recommended (average >= 7)', async () => {
    const movies = [
      buildMovie({ id: 1, average: 8 }),
      buildMovie({ id: 2, average: 6.9 }),
    ];
    const useCase = new GetMoviesUseCase(buildMoviesService(movies));

    const result = await useCase.getMovies({
      filters: { genre: '', recommended: true, year: 0 },
      sorts: { byDate: false, byAverage: false },
    });

    expect(result).toEqual([expect.objectContaining({ id: 1 })]);
  });

  it('filters by release year', async () => {
    const movies = [
      buildMovie({ id: 1, releaseDate: '2019-05-01' }),
      buildMovie({ id: 2, releaseDate: '2020-05-01' }),
    ];
    const useCase = new GetMoviesUseCase(buildMoviesService(movies));

    const result = await useCase.getMovies({
      filters: { genre: '', recommended: false, year: 2020 },
      sorts: { byDate: false, byAverage: false },
    });

    expect(result).toEqual([expect.objectContaining({ id: 2 })]);
  });

  it('sorts by release date descending', async () => {
    const movies = [
      buildMovie({ id: 1, releaseDate: '2019-01-01' }),
      buildMovie({ id: 2, releaseDate: '2021-01-01' }),
      buildMovie({ id: 3, releaseDate: '2020-01-01' }),
    ];
    const useCase = new GetMoviesUseCase(buildMoviesService(movies));

    const result = await useCase.getMovies({
      filters: { genre: '', recommended: false, year: 0 },
      sorts: { byDate: true, byAverage: false },
    });

    expect(result.map((movie) => movie.id)).toEqual([2, 3, 1]);
  });

  it('sorts by average score descending', async () => {
    const movies = [
      buildMovie({ id: 1, average: 5 }),
      buildMovie({ id: 2, average: 9 }),
      buildMovie({ id: 3, average: 7 }),
    ];
    const useCase = new GetMoviesUseCase(buildMoviesService(movies));

    const result = await useCase.getMovies({
      filters: { genre: '', recommended: false, year: 0 },
      sorts: { byDate: false, byAverage: true },
    });

    expect(result.map((movie) => movie.id)).toEqual([2, 3, 1]);
  });
});

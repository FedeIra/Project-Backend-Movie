import { describe, expect, it, vi } from 'vitest';

import { GetTvshowDetailsUseCase } from '../../src/useCases/tvShows/getTvshowsDetaillsUseCase.js';
import { TvShowService } from '../../src/services/tvShows/getTvshowDetailsService.js';

describe('GetTvshowDetailsUseCase', () => {
  it('delegates to the TV show service with the given id', async () => {
    const tvShowDetails = {
      id: 15,
      title: "Mister Rogers' Neighborhood",
      poster: 'poster.jpg',
      average: 5.351,
      releaseDate: '1968-02-19',
      genres: ['Kids'],
      numberOfSeasons: 31,
      director: [],
      seasons: [],
    };
    const getTvShowDetailsService = vi.fn().mockResolvedValue(tvShowDetails);
    const tvShowService = {
      getTvShowDetailsService,
    } as unknown as TvShowService;

    const useCase = new GetTvshowDetailsUseCase(tvShowService);
    const result = await useCase.getTvshowDetails({ tvshowId: '15' });

    expect(getTvShowDetailsService).toHaveBeenCalledWith('15');
    expect(result).toBe(tvShowDetails);
  });
});

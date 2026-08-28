// Internal modules:
import { TvShowService } from '../../services/tvShows/getTvshowDetailsService';
import { TvShowDetails } from '../../models/tvShowDetails';

// Define use case payload schema:
export type GetTvshowDetailsUseCasePayload = {
  tvshowId: string;
};

// Define use cases for getting movies:
export class GetTvshowDetailsUseCase {
  constructor(private tvShowService: TvShowService) {}

  // Use case for getting movies:
  async getTvshowDetails(
    payload: GetTvshowDetailsUseCasePayload
  ): Promise<TvShowDetails> {
    return await this.tvShowService.getTvShowDetailsService(payload.tvshowId);
  }
}

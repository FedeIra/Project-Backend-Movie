import { UserService } from '../../services/users/userService.js';

// Define use case payload and response:
export type RefreshTokenPayload = {
  previousToken: string;
};

export type RefreshTokenResponse = {
  newToken: string;
};

// Define use case for refreshing token:
export class RefreshTokenUseCase {
  constructor(private userService: UserService) {}

  async refreshToken(
    payload: RefreshTokenPayload
  ): Promise<RefreshTokenResponse> {
    return await this.userService.refreshToken(payload.previousToken);
  }
}

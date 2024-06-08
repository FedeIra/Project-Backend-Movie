// Internal modules:
import { UserService } from '../../services/users/userService.js';

// Define use case payload and response:
export type AddToWishlistPayload = {
  username: string;
  newContent: ContentToAdd;
};

export type ContentToAdd = {
  title: string;
  id: number;
  poster: string;
};

// Define use case for create user:
export class AddToWishlistUseCase {
  constructor(private addToWishlistService: UserService) {}

  async addToWishlist(payload: AddToWishlistPayload): Promise<void> {
    await this.addToWishlistService.addToWishlist(payload);
  }
}

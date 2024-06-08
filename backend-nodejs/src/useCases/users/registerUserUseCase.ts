// Internal modules:
import { UserService } from '../../services/users/userService.js';

// Define use case payload and response:
export type RegisterUserPayload = {
  username: string;
  password: string;
  email: string;
};

export type RegisterUserUseCaseResponse = {
  username: string;
  email: string;
  createdAt: Date;
  wishList: WishList[];
};

export type WishList = {
  title: string;
  id: string;
  image: string;
};

// Define use case for create user:
export class RegisterUserUseCase {
  constructor(private registerService: UserService) {}

  async registerUser(
    payload: RegisterUserPayload
  ): Promise<RegisterUserUseCaseResponse> {
    return await this.registerService.registerUser(payload);
  }
}

import { UserService } from '../../services/users/userService.js';

// Define use case payload and response:
export type LoginUserPayload = {
  username: string;
  password: string;
};

export type LoginUserResponse = {
  username: string;
  email: string;
  wishList: string[];
  token: string;
};

// Define use case for login user:
export class LoginUserUseCase {
  constructor(private userService: UserService) {}

  async loginUser(payload: LoginUserPayload): Promise<LoginUserResponse> {
    return await this.userService.loginUser(payload);
  }
}

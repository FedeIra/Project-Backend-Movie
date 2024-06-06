import { RegisterService } from '../../services/users/userService.js';
import { IUser } from '../../models/users.js';

// Define use case payload schema:
export type RegisterUserPayload = {
  username: string;
  password: string;
  email: string;
};

export type RegisterUserUseCaseResponse = {
  username: string;
  email: string;
  createdAt: Date;
  wishList: string[];
};

// Define use case for create user:
export class RegisterUserUseCase {
  constructor(private registerService: RegisterService) {}

  // Use case for creating user:
  async registerUser(
    payload: RegisterUserPayload
  ): Promise<RegisterUserUseCaseResponse> {
    return await this.registerService.registerUser(payload);
  }
}

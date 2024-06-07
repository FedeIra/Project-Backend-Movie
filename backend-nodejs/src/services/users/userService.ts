// External packages:
import bcrypt from 'bcrypt';

// Internal modules:
import { UserModel } from '../../models/users.js';
import { RegisterUserPayload } from '../../useCases/users/registerUserUserCase.js';
import {
  databaseUserSchema,
  DatabaseUserDTO,
  toModelUser,
} from './entities/users.js';
import { User } from '../../models/users.js';

// Define service interface:
export interface RegisterService {
  registerUser(data: RegisterUserPayload): Promise<User>;
}

// Define service class:
export class DataBaseServices implements RegisterService {
  async registerUser(data: RegisterUserPayload): Promise<User> {
    // 1) Check if user or email already exists:
    const existingUser: DatabaseUserDTO | null = await this.getUser(
      data.username,
      data.email
    );
    if (existingUser) {
      if (existingUser.username === data.username) {
        throw new Error('Username already exists');
      } else {
        throw new Error('Email already in use.');
      }
    }

    // 2) Hash password:
    const hash: string = await bcrypt.hash(data.password, 10);

    // 3) Create user in database:
    const dataBaseResponse = await UserModel.create({
      ...data,
      password: hash,
    });

    // 4) Validate response:
    const registerUserResponse: DatabaseUserDTO =
      databaseUserSchema.parse(dataBaseResponse);

    // 5) Convert response to model:
    const user: User = toModelUser(registerUserResponse);

    return user;
  }

  // Helper function to get user from database:
  private async getUser(
    username: string,
    email: string
  ): Promise<DatabaseUserDTO | null> {
    return await UserModel.findOne({
      $or: [{ username }, { email }],
    });
  }
}

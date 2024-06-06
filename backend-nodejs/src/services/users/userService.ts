// External packages:
import bcrypt from 'bcrypt';

// Internal modules:
import { IUser, UserModel } from '../../models/users.js';
import {
  RegisterUserPayload,
  // RegisterUserUseCaseResponse,
} from '../../useCases/users/registerUser.js';
import {
  databaseUserSchema,
  DatabaseUser,
  toModelUser,
} from './entities/users.js';
import { User } from '../../models/users.js';

// Define service interface:
export interface RegisterService {
  registerUser(data: RegisterUserPayload): Promise<User>;
}

export class DataBaseServices implements RegisterService {
  constructor() {}

  async registerUser(data: RegisterUserPayload): Promise<User> {
    // 1) Check if user already exists:
    const existingUser: DatabaseUser | null = await this.getUser(data.username);
    if (existingUser) {
      console.log(`Username already exists. ${existingUser}`);
      throw new Error('Username already exists.');
    }

    // 2) Hash password:
    const hash: string = await bcrypt.hash(data.password, 10);

    // 3) Create user in database:
    const dataBaseResponse = await UserModel.create({
      ...data,
      password: hash,
    });

    // 4) Validate response:
    const registerUserResponse: DatabaseUser =
      databaseUserSchema.parse(dataBaseResponse);

    // 5) Convert response to model:
    const user: User = toModelUser(registerUserResponse);
    console.log('🚀 ~ DataBaseServices ~ registerUser ~ user:', user);

    return user;
  }

  async getUser(username: string): Promise<DatabaseUser | null> {
    return UserModel.findOne({ username });
  }
}

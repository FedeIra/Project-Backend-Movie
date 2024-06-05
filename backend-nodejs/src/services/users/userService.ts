// External packages:
import bcrypt from 'bcrypt';

// Internal modules:
import { UserModel, IUser } from '../../models/users.js';

// Define service interface:
export interface UsersService {
  createUser(data: Omit<IUser, 'wishList'>): Promise<any>;
}

export class DataBaseServices implements UsersService {
  constructor() {}

  async createUser(data: Omit<IUser, 'wishList'>): Promise<any> {
    const existingUser = await this.getUser(data.username);
    if (existingUser) {
      throw new Error('Username already exists.');
    }

    // const hash = await bcrypt.hash(data.password, 10);

    const newUser = await UserModel.create({
      ...data,
      // password: hash,
    });

    return newUser;
  }

  async getUser(username: string): Promise<IUser | null> {
    return UserModel.findOne({ username });
  }

  // async getUserById(
  //   id: string
  // ): Promise<{ id: string; username: string; createdAt: Date }> {
  //   const user = await UserModel.findById(id);
  //   if (!user) {
  //     throw new Error('User not found.');
  //   }
  //   return {
  //     id: user.id,
  //     username: user.username,
  //     createdAt: user.createdAt,
  //   };
  // }
}

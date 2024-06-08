// External packages:
import bcrypt from 'bcrypt';
import { FastifyInstance } from 'fastify';
import mongoose from 'mongoose';

// Internal modules:
import { UserModel, WishList } from '../../models/users.js';
import { RegisterUserPayload } from '../../useCases/users/registerUserUseCase.js';
import { LoginUserPayload } from '../../useCases/users/loginUserUseCase.js';
import { AddToWishlistPayload } from '../../useCases/users/addToWishlistUseCase.js';
import {
  DecodedToken,
  databaseUserSchema,
  DatabaseUserDTO,
  toModelUserRegistration,
  toModelUserLogin,
} from './entities/users.js';
import { UserRegistration, User } from '../../models/users.js';

// Define service interface:
export interface UserService {
  registerUser(payload: RegisterUserPayload): Promise<UserRegistration>;
  loginUser(payload: LoginUserPayload): Promise<User>;
  refreshToken(refreshToken: string): Promise<string>;
  addToWishlist(payload: AddToWishlistPayload): Promise<void>;
}

// Define service class:
export class DataBaseServices implements UserService {
  private fastifyServer: FastifyInstance;

  constructor(fastifyServer: FastifyInstance) {
    this.fastifyServer = fastifyServer;
  }

  // Register user service method:
  async registerUser(payload: RegisterUserPayload): Promise<UserRegistration> {
    // 1) Check if user or email already exists:
    const existingUser: DatabaseUserDTO | null = await this.getUser(
      payload.username,
      payload.email
    );
    if (existingUser) {
      if (existingUser.username === payload.username) {
        throw new Error('Username already exists');
      } else {
        throw new Error('Email already in use.');
      }
    }

    // 2) Hash password:
    const hash: string = await bcrypt.hash(payload.password, 10);

    // 3) Create user in database:
    const dataBaseResponse = await UserModel.create({
      ...payload,
      password: hash,
    });

    // 4) Validate response:
    const registerUserResponse: DatabaseUserDTO =
      databaseUserSchema.parse(dataBaseResponse);

    // 5) Convert response to model:
    const registeredUser: UserRegistration =
      toModelUserRegistration(registerUserResponse);

    return registeredUser;
  }

  // Login user service method:
  async loginUser(payload: LoginUserPayload): Promise<User> {
    // 1) Check if user exist:
    const user: DatabaseUserDTO | null = await this.getUser(payload.username);

    // 2) Validate user and password:
    if (
      !user ||
      !user.password ||
      !(await bcrypt.compare(payload.password, user.password))
    ) {
      throw new Error('Invalid username or password');
    }

    // 3) Generate token:
    const token: string = await this.getToken(user._id, user.username);

    // 4) Convert response to model:
    const loggedUser: User = toModelUserLogin(user, token);

    return loggedUser;
  }

  // Refresh token service method:
  async refreshToken(refreshToken: string): Promise<string> {
    // 1) Decode token:
    const decodedToken: DecodedToken | null =
      await this.decodeToken(refreshToken);

    if (!decodedToken) {
      throw new Error('Invalid token');
    }

    // 2) Generate new token:
    const token: string = await this.getToken(
      decodedToken.id,
      decodedToken.username
    );

    return token;
  }

  // Add to wishlist service method:
  async addToWishlist(payload: AddToWishlistPayload): Promise<void> {
    // 1) Get user:
    const user: DatabaseUserDTO | null = await this.getUser(payload.username);

    if (!user) {
      throw new Error('User not found');
    }

    // 2) Add content to wishlist:
    const updatedWishlist: WishList[] = [
      ...user.wishList,
      {
        id: payload.newContent.id,
        title: payload.newContent.title,
        image: payload.newContent.poster,
      },
    ];

    // 3) Update user wishlist:
    await this.addContentWishlist(payload.username, updatedWishlist);
  }

  // Helper function to get user from database:
  private async getUser(
    username: string,
    email?: string
  ): Promise<DatabaseUserDTO | null> {
    return await UserModel.findOne({
      $or: [{ username }, { email }],
    });
  }

  // Helper function to obtain token:
  private async getToken(
    id: mongoose.Types.ObjectId | string,
    username: string
  ): Promise<string> {
    return this.fastifyServer.jwt.sign({
      id,
      username,
    });
  }

  // Helper function to obtain refresh token:
  private async decodeToken(token: string): Promise<DecodedToken | null> {
    return this.fastifyServer.jwt.decode(token);
  }

  // Helper function to add content to wishlist:
  private async addContentWishlist(
    username: string,
    payload: WishList[]
  ): Promise<void> {
    await UserModel.updateOne({ username }, { $set: { wishList: payload } });
  }
}

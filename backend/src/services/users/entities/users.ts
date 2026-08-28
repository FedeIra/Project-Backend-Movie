// External packages:
import { z } from 'zod';
import mongoose from 'mongoose';

// Internal modules:
import { UserRegistration, User } from '../../../models/users.js';

// Type for user decoded token:
export type DecodedToken = {
  id: string;
  username: string;
  iat: number;
};

// Define Database user response schema:
export const databaseUserSchema = z.object({
  _id: z.instanceof(mongoose.Types.ObjectId),
  username: z.string(),
  password: z.string().optional(),
  email: z.string(),
  wishList: z.array(
    z.object({
      title: z.string(),
      id: z.number(),
      image: z.string(),
    })
  ),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
  __v: z.number().optional(),
});

// Define Database user DTO type:
export type DatabaseUserDTO = z.infer<typeof databaseUserSchema>;

// Converter Database user registration response to model:
export const toModelUserRegistration = (
  dataBaseResponse: DatabaseUserDTO
): UserRegistration => {
  return {
    username: dataBaseResponse.username,
    email: dataBaseResponse.email,
    wishList: dataBaseResponse.wishList,
    createdAt: dataBaseResponse.createdAt,
  };
};

// Converter Database user login response to model:
export const toModelUserLogin = (
  dataBaseResponse: DatabaseUserDTO,
  token: string
): User => {
  return {
    username: dataBaseResponse.username,
    email: dataBaseResponse.email,
    wishList: dataBaseResponse.wishList,
    token,
  };
};

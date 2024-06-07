// External packages:
import { z } from 'zod';
import mongoose from 'mongoose';

// Internal modules:
import { User } from '../../../models/users.js';

// Define Database user response schema:
export const databaseUserSchema = z.object({
  _id: z.instanceof(mongoose.Types.ObjectId).optional(),
  username: z.string(),
  password: z.string().optional(),
  email: z.string(),
  wishList: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
  __v: z.number().optional(),
});

// Define Database user DTO type:
export type DatabaseUserDTO = z.infer<typeof databaseUserSchema>;

// Converter Database user response to model:
export const toModelUser = (dataBaseResponse: DatabaseUserDTO): User => {
  return {
    username: dataBaseResponse.username,
    email: dataBaseResponse.email,
    wishList: dataBaseResponse.wishList,
    createdAt: dataBaseResponse.createdAt,
  };
};

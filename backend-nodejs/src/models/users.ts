// External packages:
import Mongoose, { Schema, Document } from 'mongoose';

// Internal modules:
import config from '../../packages/env/config.js';

// User model type:
export type UserRegistration = {
  username: string;
  email: string;
  createdAt: Date;
  wishList: WishList[];
};

export type User = {
  username: string;
  email: string;
  wishList: WishList[];
  token: string;
};

export type WishList = {
  title: string;
  id: number;
  image: string;
};

export type UserToken = {
  newToken: string;
};

// User model schema:
export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  wishList: WishList[];
}

const userSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 4,
      maxlength: 12,
    },
    password: { type: String, required: true, minlength: 6 },
    email: { type: String, required: true, match: /.+\@.+\..+/ },
    wishList: {
      type: [
        {
          title: { type: String, required: true },
          id: { type: Number, required: true },
          image: { type: String, required: true },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export const UserModel = Mongoose.model(
  config.usersCollection as string,
  userSchema
);

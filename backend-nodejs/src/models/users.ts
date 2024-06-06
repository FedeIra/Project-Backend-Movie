// External packages:
import Mongoose, { Schema } from 'mongoose';

// Internal modules:
import config from '../../packages/env/config.js';

export type User = {
  username: string;
  email: string;
  createdAt: Date;
  wishList: string[];
};

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  wishList: string[];
}

export const userSchema: Schema<IUser> = new Schema(
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
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export const UserModel = Mongoose.model(
  config.usersCollection as string,
  userSchema
);

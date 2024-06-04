// External packages:
import Mongoose, { Schema } from 'mongoose';

// Internal modules:
import config from '../../packages/env/config.js';

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  wishList: Schema.Types.ObjectId[];
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
      type: [{ type: Schema.Types.ObjectId, ref: `TMDB Movie Id` }],
      default: [],
    },
  },
  { timestamps: true }
);

export const UserModel = Mongoose.model<IUser>(
  `${config.usersCollection}`,
  userSchema
);

import mongoose, { Schema } from "mongoose";

export interface ImageType extends mongoose.Document {
  url: string;
  fileName: string;
}

export interface UserType extends mongoose.Document {
  name: string;
  email: string;
  password: number;
  image: ImageType;
}

const ImageSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
});

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: ImageSchema,
    },
  },
  { timestamps: true }
);

const User = mongoose.model<UserType>("User", UserSchema);
export default User;

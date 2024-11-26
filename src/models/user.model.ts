import mongoose, { Document, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { IVideo } from "./video.model.js";

export interface IUser extends Document {
  username: string;
  email: string;
  fullName: string;
  avatar: string; // cloudinary URL
  coverImage?: string; // cloudinary URL (optional)
  watchHistory: string[]; // Array of video IDs (ObjectIds as strings)
  password: string;
  refreshToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercas: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercas: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //cloudinary url
      required: true,
    },
    coverImage: {
      type: String, //cloudinary url
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign({
    _id: this._id,
    email: this.email,
    username: this.username,
    fullName: this.fullName
  },
  process.env.ACCESS_TOKEN_SECRET!,
  {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
  }
)
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({
    _id: this._id,
  },
  process.env.REFRESH_TOKEN_SECRET!,
  {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY
  }
)
};

export const User = mongoose.model<IUser>("User", userSchema);

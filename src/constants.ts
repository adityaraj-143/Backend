import { InferSchemaType, Types } from "mongoose";
import { userSchema } from "./models/user.model.js";
import { videoSchema } from "./models/video.model.js";
import { Request } from "express";

export const DB_NAME = "backend";

export type jwtTokendcd = {
  _id: string;
};

export interface customjwtreq extends Request {
  user: IUser;
}

export interface CustomRequest extends Request {
    files?: {
      avatar?: Express.Multer.File[];
      coverImage?: Express.Multer.File[];
    };
  }

export type IUser = InferSchemaType<typeof userSchema> & {
  _id: Types.ObjectId;
  isPasswordCorrect: (password: string) => Promise<Boolean>;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
};

export type IVideo = InferSchemaType<typeof videoSchema> & {
  _id: Types.ObjectId;
};

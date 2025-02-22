import { commentSchema } from "@/models/comment.model.ts";
import { likeSchema } from "@/models/like.model.ts";
import { subscriptionSchema } from "@/models/subcription.model.js";
import { tweetSchema } from "@/models/tweet.model.ts";
import { userSchema } from "@/models/user.model.js";
import { videoSchema } from "@/models/video.model.js";
import { Request } from "express";
import { InferSchemaType, Types } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      files?: {
        avatar?: Express.Multer.File[];
        coverImage?: Express.Multer.File[];
        videofile?: Express.Multer.File[];
        thumbnail?: Express.Multer.File[]; 
      };
      user?: IUser;
    };
  }
}

export type jwtTokendcd = {
  _id: string;
};

export type IUser = InferSchemaType<typeof userSchema> & {
  _id: Types.ObjectId;
  isPasswordCorrect: (password: string) => Promise<Boolean>;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
};

export type IVideo = InferSchemaType<typeof videoSchema> & {
  _id: Types.ObjectId;
};

export type ISubscriber = InferSchemaType<typeof subscriptionSchema> & {
  _id: Types.ObjectId;
};

export type ITweet = InferSchemaType<typeof tweetSchema> & {
  _id: Types.ObjectId;
}

export type IComment = InferSchemaType<typeof commentSchema> & {
  _id: Types.ObjectId
}

export type ILike = InferSchemaType<typeof likeSchema> & {
  _id: Types.ObjectId
}

export type IPlaylist = InferSchemaType<typeof playlistSchema> & {
  _id: Types.ObjectId
}
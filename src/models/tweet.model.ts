import { ITweet } from "@/types/types.js";
import mongoose, { Schema, Types } from "mongoose";

export const tweetSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    owner: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Tweet = mongoose.model<ITweet>("Tweet", tweetSchema);

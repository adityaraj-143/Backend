import { IPlaylist } from "@/types/types.js";
import mongoose, { Schema, Types } from "mongoose";

export const playlistSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    videos: [
      {
        type: Types.ObjectId,
        ref: "Video",
      },
    ],
    owner: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Playlist = mongoose.model<IPlaylist>("Playlist", playlistSchema);

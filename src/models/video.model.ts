import mongoose, { Document, Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { IUser } from "./user.model.js";

export interface IVideo extends Document {
  videofile: string; // Cloudinary URL for the video
  thumbnail: string; // Cloudinary URL for the thumbnail
  title: string; 
  description: string; 
  duration: number; 
  views: number; 
  isPublished: boolean; 
  owner: IUser["_id"]; // User ObjectId (reference to User model)
  createdAt?: Date; 
  updatedAt?: Date; 
}

const videoSchema = new Schema<IVideo>(
  {
    videofile: {
      type: String, //cloudinary
      required: true,
    },
    thumbnail: {
      type: String, //cloudinary
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, //cloudinary 
      required: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
  },
  {
    timestamps: true,
  }
);

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model<IVideo>("Video", videoSchema);

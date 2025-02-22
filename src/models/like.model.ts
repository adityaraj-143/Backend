import { ILike } from "@/types/types.js";
import mongoose, { Schema, Types} from "mongoose";

export const likeSchema = new Schema({
    video: {
        type: Types.ObjectId,
        ref: "Video"
    },
    comment: {
        type: Types.ObjectId,
        ref: "Comment"
    },
    tweet: {
        type: Types.ObjectId,
        ref: "Tweet"
    },
    likedBy: {
        type: Types.ObjectId,
            ref: "User"
    },
}, {timestamps: true})

export const Like = mongoose.model<ILike>("Like", likeSchema)
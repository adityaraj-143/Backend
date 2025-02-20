import mongoose, {Schema, Types} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    video: {
        type: Types.ObjectId,
        ref: "Video"
    },
    owner: {
        type: Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})

commentSchema.plugin(mongooseAggregatePaginate)

export const Comment = mongoose.model("Comment", commentSchema)
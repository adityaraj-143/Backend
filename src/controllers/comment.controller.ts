import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { IComment } from "@/types/types.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const skip = (page - 1) * limit;
  const comments = await Comment.find({ video: videoId })
    .skip(skip)
    .limit(limit);

  if (!comments) throw new ApiError(404, "Comments not found");

  res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments found successfully"));
});

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.query;
  const userId = req.user?._id;
  const { content } = req.body;

  const comment: IComment = await Comment.create({
    content,
    video: videoId,
    owner: userId,
  });

  if (!comment) throw new ApiError(401, "Couldn't create comment");

  res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment created successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;
  const { content } = req.body;

  if (!isValidObjectId(commentId)) throw new ApiError(401, "Invalid object id");

  const comment = await Comment.findByIdAndUpdate(
    commentId,
    {
      content,
    },
    { new: true }
  );

  if (!comment) throw new ApiError(401, "Couldn't update comment");

  res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated succesfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;
  if (!isValidObjectId(commentId)) throw new ApiError(401, "Invalid object id");

  await Comment.findByIdAndDelete(commentId);

  res.status(200).json(new ApiResponse(200, "Comment deleted succefully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };

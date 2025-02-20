import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";

import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const userId = req.user?._id;

  if (!userId) throw new ApiError(401, "Couldn't create a tweet");

  if (content.trim() === "") throw new ApiError(401, "Content is required");

  const tweet = await Tweet.create({
    content,
    owner: userId,
  });

  if (!tweet) throw new ApiError(401, "Couldn't create tweet");

  res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.query;

  if (!userId) throw new ApiError(401, "User Id is required to fetch tweets");
  if(!isValidObjectId(userId)) throw new ApiError(401, "Invalid user id");

  const tweets = await Tweet.aggregate([
    {
      $match: { owner: userId },
    },
  ]);

  res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweets fetched succefully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const {tweetId} = req.query;

  if(!isValidObjectId(tweetId)) throw new ApiError(401, "Invalid tweet id");

  if (!content) throw new ApiError(400, "Content is required");

  const tweet = await Tweet.findByIdAndUpdate({ tweetId }, { content });

  if (!tweet) throw new ApiError(500, "Couldn't update tweet");

  res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {

  const {tweetId} = req.query;

  if(!isValidObjectId(tweetId)) throw new ApiError(401, "Invalid tweet id");

  await Tweet.findByIdAndDelete({tweetId});

  res.status(200).json(new ApiResponse(200, "Tweet deleted succefully"))

});

export { createTweet, getUserTweets, updateTweet, deleteTweet };

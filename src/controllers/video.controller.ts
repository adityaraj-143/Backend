import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video
  if ([title, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  if (!req.files || !req.files.videofile || req.files.videofile.length === 0) {
    throw new ApiError(400, "Video file is required");
  }

  if (!req.files || !req.files.thumbnail || req.files.thumbnail.length === 0) {
    throw new ApiError(400, "thumbnail file is required");
  }

  const videofileLocalPath = req.files.videofile[0].path;
  const thumbnailLocalPath = req.files.thumbnail[0].path;

  if (!(videofileLocalPath || thumbnailLocalPath))
    throw new ApiError(400, "video File or thumbnail is missing");

  const videofile = await uploadOnCloudinary(videofileLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!videofile || !thumbnail)
    throw new ApiError(400, "video File or thumbnail is missing");

  const video = Video.create({
    videofile: videofile.url,
    thumbnail: thumbnail.url,
    title,
    description,
    duration: videofile.duration,
    owner: req.user?._id
  })
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id

  if (!videoId) throw new ApiError(404, "Video Id not found");

  const video = await Video.findById(videoId);

  if (!video) throw new ApiError(404, "Video not found");

  res
    .status(200)
    .json(new ApiResponse(200, video.videofile, "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const { title, description } = req.body;

  if (!(title || description))
    throw new ApiError(400, "all fields are required");

  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title: title,
        description: description,
      },
    },
    { new: true }
  );

  res
    .status(200)
    .json(new ApiResponse(200, video, "video details updated successfully"));
});

const updateVideoThumbnail = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const thumbnailLocalPath = req.file?.path;

  if (!thumbnailLocalPath) throw new ApiError(400, "Thumbnail file is missing");

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!thumbnail?.url)
    throw new ApiError(400, "error while uploading thumnail");

  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        thumbnail: thumbnail.url,
      },
    },
    {
      new: true,
    }
  );

  res
    .status(200)
    .json(new ApiResponse(200, video, "thumbnail changed successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  updateVideoThumbnail,
};

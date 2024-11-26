import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Request, Response } from "express";

export interface CustomRequest extends Request {
  files?: {
    avatar?: Express.Multer.File[];
    coverImage?: Express.Multer.File[];
  };
}

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const customReq = req as CustomRequest;
  const { fullName, email, username, password } = req.body;

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  if (
    !customReq.files ||
    !customReq.files.avatar ||
    customReq.files.avatar.length === 0
  ) {
    throw new ApiError(400, "Avatar File is required");
  }

  // console.log("\n req.files: ", req.files);

  const avatarLocalPath = customReq?.files?.avatar[0].path;
  const coverImageLocalPath = customReq.files?.coverImage?.[0]?.path ?? null;

  if (!avatarLocalPath) throw new ApiError(400, "Avatar File is required");

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : { url: "" };

  if (!avatar) throw new ApiError(400, "Avatar is required");

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refereshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});


export { registerUser };

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Request, Response } from "express";
import { Types } from "mongoose";
import { customjwtreq, CustomRequest, jwtTokendcd } from "../constants.js";
import jwt from "jsonwebtoken"

const options = {
  httpOnly: true,
  secure: true,
};

const generateTokens = async (userId: Types.ObjectId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user?.generateAccessToken();
    const refreshToken = user?.generateRefreshToken();

    if (user) {
      user.refreshToken = refreshToken;
    }

    user?.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh or access token! "
    );
  }
};

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

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!(username || email))
    throw new ApiError(400, "username or email is required");

  const user = await User.findOne({
    $or: [{username}, {email} ],
  });

  if (!user) throw new ApiError(404, "user doesn't exist");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "invalid user credentials");

  const { accessToken, refreshToken } = await generateTokens(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );    

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User Logged in Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const customReq = req as customjwtreq;
  await User.findByIdAndUpdate(
    customReq.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req: Request, res:Response) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

  if(!incomingRefreshToken) throw new ApiError(401, "Unauthorized request");

  const dcdToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET!)
  const decodedToken = dcdToken as jwtTokendcd;

  const user = await User.findById(decodedToken?._id)

  if(!user) throw new ApiError(401, "Invalid refresh token");

  if(incomingRefreshToken !== user?.refreshToken) throw new ApiError(401, "Refresh token is expired or used");
  
  const {accessToken, refreshToken: newRefreshToken} = await generateTokens(user._id)

  return res
  .status(200)
  .cookie("accessToken", accessToken)
  .cookie("refreshToken", newRefreshToken)
  .json(
    new ApiResponse(
      200,
      {accessToken, refreshToken: newRefreshToken},
      "Access token refreshed"
    )
  )

})

export { registerUser, loginUser, logoutUser, refreshAccessToken };

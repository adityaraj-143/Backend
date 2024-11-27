import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { customjwtreq, CustomRequest, jwtTokendcd } from "../constants.js";

export const verifyJWT = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      if (!token) throw new ApiError(401, "Unauthorized request");

      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
      const dcdToken = decodedToken as jwtTokendcd;

      const user = await User.findById(dcdToken._id).select(
        "-password -refreshToken"
      );

      if (!user) throw new ApiError(401, "Invalid Access Token");

      const customReq = req as customjwtreq;

      customReq.user = user;

      next();
    } catch (error) {
      throw new ApiError(401, "Invalid access Token");
    }
  }
);

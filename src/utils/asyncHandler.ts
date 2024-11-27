import { NextFunction, Request, Response } from "express";

const asyncHandler =
  (
    requestHandler: (
      req: Request,
      res: Response,
      next: NextFunction
    ) => any
  ) =>
  async (req: Request , res: Response, next: NextFunction) => {
    try {
      await requestHandler(req , res, next);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export { asyncHandler };

/*
const asyncHandler = (requestHandler) => {
    return (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next)).catch((err) => next(err));
    }
}
*/

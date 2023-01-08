import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler.middleware";
import User from "../models/User.model";
import { IDecodedJwtPayload } from "../types";
import AppErr from "../utils/AppErr";

/**
 * @GET_ALL_USERS
 * @ROUTE @GET {{URL}}/api/v1/users
 * @returns All found Users
 * @ACCESS Private (Admin only)
 */
export const getAllUsers = asyncHandler(
  async (_req: Request, res: Response, next: NextFunction) => {
    const users = await User.find({});

    if (!users.length) {
      return next(new AppErr("No user found", 404));
    }

    res.status(200).json({
      success: true,
      users,
    });
  }
);

/**
 * @GET_CURRENT_USER_DETAILS
 * @ROUTE @GET {{URL}}/api/v1/users/me
 * @returns Logged in User  details
 * @ACCESS Private (Logged in user only)
 */
export const getMe = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user?.user_id);

    if (!user) {
      return next(new AppErr("Unauthorized, please login first", 401));
    }

    res.status(200).json({
      success: true,
      message: "User details",
      user,
    });
  }
);

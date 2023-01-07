import { NextFunction, Request, Response } from "express";
import User from "../models/User.model";
import AppErr from "../utils/AppErr";

export const getAllUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  const users = await User.find({});

  if (!users.length) {
    return next(new AppErr("No user found", 404));
  }

  res.status(200).json({
    success: true,
    users,
  });
};

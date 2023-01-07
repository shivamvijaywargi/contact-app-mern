import { NextFunction, Request, Response } from "express";
import User from "../models/User.model";

export const getAllUsers = async (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const users = await User.find({});

  if (!users.length) {
    res.status(404).json({
      success: false,
      message: "No user found",
    });
  }

  res.status(200).json({
    success: true,
    users,
  });
};

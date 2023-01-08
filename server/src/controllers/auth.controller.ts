import crypto from "crypto";
import { NextFunction, Request, Response } from "express";

import asyncHandler from "../middlewares/asyncHandler.middleware";
import User from "../models/User.model";
import AppErr from "../utils/AppErr";
import sendEmail from "../utils/sendEmail";

const cookieOptions = {
  secure: true,
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

/**
 * @REGISTER
 * @ROUTE @POST {{URL}}/api/v1/auth/new
 * @returns Refresh(cookies) + Access token(response) and user created successfully message
 * @ACCESS Public
 */
export const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, phoneNumber } = req.body;

    const userExist = await User.findOne({ email }).lean();

    if (userExist) {
      return next(new AppErr("User already registeres", 409));
    }

    const user = await User.create({
      email,
      name,
      password,
      phoneNumber,
    });

    if (!user) {
      return next(
        new AppErr("User registration failed, please try again.", 400)
      );
    }

    user.password = undefined;

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    res.cookie("refreshToken", refreshToken, cookieOptions);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      accessToken,
      user,
    });
  }
);

/**
 * @LOGIN
 * @ROUTE @POST {{URL}}/api/v1/auth
 * @returns Refresh(cookies) + Access token(response) and user logged in successfully message
 * @ACCESS Public
 */
export const loginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppErr("Email and Password are required", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return next(
        new AppErr(
          "Email and password do not match or user does not exist",
          400
        )
      );
    }

    user.password = undefined;

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    res.cookie("refreshToken", refreshToken, cookieOptions);

    res.status(200).json({
      success: true,
      message: "User Logged in successfully",
      accessToken,
      user,
    });
  }
);

/**
 * @FORGOT_PASSWORD
 * @ROUTE @POST {{URL}}/api/v1/auth/reset
 * @returns Passwors reset token email sent to user successfully
 * @ACCESS Public
 */
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email) {
      return next(new AppErr("Email is required", 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return next(new AppErr("User not found, please register", 404));
    }

    const resetToken = await user.generatePasswordResetToken();

    await user.save();

    const resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/reset/${resetToken}`;

    const subject = "Reset your password";
    const message = `Here is your password reset token\n${resetPasswordUrl}.\nIf you did not request this, please ignore.`;

    try {
      await sendEmail(email, subject, message);

      res.status(200).json({
        success: true,
        message: `Password reset email sent to ${email} successfully`,
      });
    } catch (error: any) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpiry = undefined;

      await user.save();

      return next(
        new AppErr(
          error.message || "Something went wrong, please try again.",
          400
        )
      );
    }
  }
);

/**
 * @RESET_PASSWORD
 * @ROUTE @POST {{URL}}/api/v1/auth/reset/:token
 * @returns Password changed successfully
 * @ACCESS Public
 */
export const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params;
    const { password } = req.body;

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return next(
        new AppErr(
          "Reset password token is invalid or expired, please try again.",
          400
        )
      );
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully, please login",
    });
  }
);

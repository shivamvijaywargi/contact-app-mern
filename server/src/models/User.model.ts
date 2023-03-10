import crypto from "crypto";

import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import ROLES_LIST from "../configs/ROLES_LIST";

const userSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [3, "Name must be atleast 3 characters long"],
      maxlength: [20, "Name cannot be more than 20 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please fill in a valid email address",
      ],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be atleast 8 characters long"],
      select: false,
    },
    role: {
      type: Number,
      enum: [ROLES_LIST.ADMIN, ROLES_LIST.USER],
      default: ROLES_LIST.USER,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    contacts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Contact",
      },
    ],
    resetPasswordToken: String,
    resetPasswordExpiry: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods = {
  comparePassword: async function (plainPassword: string) {
    return bcrypt.compare(plainPassword, this.password);
  },
  generateAccessToken: async function () {
    return jwt.sign(
      { user_id: this._id, role: this.role },
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );
  },
  generateRefreshToken: async function () {
    return jwt.sign(
      { user_id: this._id, role: this.role },
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      }
    );
  },
  generatePasswordResetToken: async function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    this.resetPasswordExpiry = Date.now() + 15 * 60 * 1000;

    return resetToken;
  },
};

const User = model("User", userSchema);

export default User;

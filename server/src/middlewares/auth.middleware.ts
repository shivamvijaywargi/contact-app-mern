import jwt, { JwtPayload } from "jsonwebtoken";
import AppErr from "../utils/AppErr";

import asyncHandler from "./asyncHandler.middleware";

declare module "express" {
  export interface Request {
    user?: string | JwtPayload;
  }
}

const verifyToken = asyncHandler(async (req, res, next) => {
  let token: string;

  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    return next(new AppErr("You are not Authorized, please login", 401));
  }

  if (!token) {
    return next(new AppErr("You are not Authorized, please login", 401));
  }

  const decoded = await jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string
  );

  if (decoded) {
    return next(new AppErr("Unauthorized, please login", 401));
  }

  req.user = decoded;

  next();
});

export default verifyToken;

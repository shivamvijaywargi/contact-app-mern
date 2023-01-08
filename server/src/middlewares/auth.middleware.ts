import jwt, { JwtPayload } from "jsonwebtoken";
import { IDecodedJwtPayload } from "../types";
import AppErr from "../utils/AppErr";

import asyncHandler from "./asyncHandler.middleware";

declare module "express" {
  export interface Request {
    user?: IDecodedJwtPayload;
  }
}

const verifyToken = asyncHandler(async (req, _res, next) => {
  let token: string | JwtPayload;

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

  const decoded = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET!
  ) as IDecodedJwtPayload;

  if (!decoded) {
    return next(new AppErr("Unauthorized, please login", 401));
  }

  req.user = decoded;

  next();
});

export default verifyToken;

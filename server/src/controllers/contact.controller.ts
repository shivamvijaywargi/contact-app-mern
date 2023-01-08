import { NextFunction, Request, Response } from "express";

import asyncHandler from "../middlewares/asyncHandler.middleware";
import User from "../models/User.model";
import AppErr from "../utils/AppErr";

/**
 * @CREATE_CONTACT
 * @ROUTE @POST {{URL}}/api/v1/contacts
 * @returns Creates a new contact
 * @ACCESS Private (Logged in user only)
 */
export const createContact = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user?.user_id);
  }
);

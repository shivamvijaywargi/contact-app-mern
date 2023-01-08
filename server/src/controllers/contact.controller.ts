import { NextFunction, Request, Response } from "express";

import asyncHandler from "../middlewares/asyncHandler.middleware";
import Contact from "../models/Contact.model";
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
    const userId = req.user?.user_id;
    const { name, email, phoneNumber } = req.body;

    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return next(new AppErr("User not found", 404));
    }

    if (!name || !phoneNumber) {
      return next(new AppErr("Name and Phone Number are required", 400));
    }

    const contact = await Contact.create({
      name,
      email,
      phoneNumber,
      user: userId,
    });

    if (!contact) {
      return next(new AppErr("Something went wrong, please try again", 400));
    }

    existingUser.contacts.push(contact);

    await existingUser.save();

    res.status(201).json({
      success: true,
      message: "Contact created successfully",
    });
  }
);
